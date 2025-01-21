import { StatusCodes } from "http-status-codes";
import mongoose, { ObjectId } from "mongoose";
import { Workshop } from "../interfaces";
import UserModel from "../models/userModel";
import WorkshopModel from "../models/workshopModel";
import AppError from "../utils/appError";

const getWorkshops = async (): Promise<Workshop[]> => {
  const workshops = await WorkshopModel.find();

  return workshops;
};

const getWorkshop = async (workshopId: string): Promise<Workshop> => {
  const workshop = await WorkshopModel.findById(workshopId);

  if (!workshop) {
    throw new AppError(StatusCodes.NOT_FOUND, "Workshop not found");
  }

  return workshop;
};

const createWorkshop = async (workshopData: Workshop): Promise<Workshop> => {
  const currentTime = new Date();

  if (new Date(workshopData.deadline) <= currentTime) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The deadline must be in the future."
    );
  }

  if (workshopData.maxAttendee < 100) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The maximum attendees must be at least 100."
    );
  }

  const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;

  if (
    new Date(workshopData.dateTime) <= currentTime ||
    new Date(workshopData.dateTime).getTime() <
      new Date(workshopData.deadline).getTime() + threeDaysInMillis
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop date must be at least 3 days after the deadline and in the future."
    );
  }

  if (workshopData.duration < 3 || workshopData.duration > 8) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop duration must be between 3 and 8 hours."
    );
  }

  if (!workshopData.instructors || workshopData.instructors.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop must have at least one instructor."
    );
  }

  const workshop = new WorkshopModel(workshopData);

  await workshop.save();

  return workshop;
};

const updateWorkshop = async (
  workshopId: string,
  workshopData: Workshop
): Promise<Workshop> => {
  const currentTime = new Date();

  if (new Date(workshopData.deadline) <= currentTime) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The deadline must be in the future."
    );
  }

  if (workshopData.maxAttendee < 100) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The maximum attendees must be at least 100."
    );
  }

  const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;

  if (
    new Date(workshopData.dateTime) <= currentTime ||
    new Date(workshopData.dateTime).getTime() <
      new Date(workshopData.deadline).getTime() + threeDaysInMillis
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop date must be at least 3 days after the deadline and in the future."
    );
  }

  if (workshopData.duration < 3 || workshopData.duration > 8) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop duration must be between 3 and 8 hours."
    );
  }

  if (!workshopData.instructors || workshopData.instructors.length === 0) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The workshop must have at least one instructor."
    );
  }

  const workshop = await WorkshopModel.findByIdAndUpdate(
    workshopId,
    workshopData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!workshop) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while updating workshop"
    );
  }

  return workshop;
};

const deleteWorkshop = async (
  workshopId: string
): Promise<{ message: string }> => {
  const workshop = await WorkshopModel.findByIdAndDelete(workshopId);

  if (!workshop) {
    throw new AppError(StatusCodes.NOT_FOUND, "Workshop not found");
  }

  return { message: "Workshop successfully deleted" };
};

const registerWorkshop = async (
  workshopId: string,
  userId: ObjectId
): Promise<{ message: string }> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const workshop = await WorkshopModel.findById(workshopId).session(session);

    if (!workshop) {
      throw new AppError(StatusCodes.NOT_FOUND, "Workshop not found");
    }

    const isUserRegistered = workshop.users.find(
      (user) => user.toString() === userId.toString()
    );

    if (isUserRegistered) {
      throw new AppError(
        StatusCodes.CONFLICT,
        "User already registered for this workshop"
      );
    }

    if (workshop.status !== "upcoming") {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Cannot register for a workshop that is not upcoming"
      );
    }

    if (workshop.users.length >= workshop.maxAttendee) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Workshop is fully booked");
    }

    const user = await UserModel.findById(userId).session(session);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    workshop.users.push(userId);
    user.workshops.push(workshop._id);

    if (user.role === "member") {
      user.points += 250;
    } else {
      user.points += 100;
    }

    await workshop.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    return { message: "Successfully registered for the workshop" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const WorkshopServices = {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  registerWorkshop,
};
