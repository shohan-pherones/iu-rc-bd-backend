import { StatusCodes } from "http-status-codes";
import { Workshop } from "../interfaces";
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

export const WorkshopServices = {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
