import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import envConfig from "../config/envConfig";
import { Auth } from "../interfaces";
import UserModel from "../models/userModel";
import AppError from "../utils/appError";
import { createToken } from "../utils/jwtHandlers";

const applyForMembership = async (
  userId: string,
  volunteerPass: string
): Promise<Auth> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const daysDifference =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDifference < 30) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "User must be at least 30 days old to apply for membership."
      );
    }

    if (user.workshops.length < 5) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "User must have joined at least 5 workshops to apply for membership."
      );
    }

    if (user.points < 500) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "User must have at least 500 points to apply for membership."
      );
    }

    if (user.comments.length < 5) {
      throw new AppError(
        StatusCodes.NOT_ACCEPTABLE,
        "User must have made at least 5 comments to apply for membership."
      );
    }

    if (volunteerPass !== (envConfig.volunteer_pass as string)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Invalid volunteer pass provided."
      );
    }

    if (user.role === "member") {
      throw new AppError(StatusCodes.BAD_REQUEST, "You are already a member.");
    }

    user.role = "member";
    user.points -= 250;

    await user.save({ session });

    const jwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const accessToken = createToken(
      jwtPayload,
      envConfig.jwt_access_secret as string,
      envConfig.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      envConfig.jwt_refresh_secret as string,
      envConfig.jwt_refresh_expires_in as string
    );

    await session.commitTransaction();

    return { accessToken, refreshToken, user };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const cancelMembership = async (
  userId: string,
  volunteerPass: string
): Promise<Auth> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (volunteerPass !== (envConfig.volunteer_pass as string)) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "Invalid volunteer pass provided."
    );
  }

  user.role = "user";

  await user.save();

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    envConfig.jwt_access_secret as string,
    envConfig.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    envConfig.jwt_refresh_secret as string,
    envConfig.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken, user };
};

export const MembershipServices = {
  applyForMembership,
  cancelMembership,
};
