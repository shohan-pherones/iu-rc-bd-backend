import { StatusCodes } from "http-status-codes";
import envConfig from "../config/envConfig";
import { Auth, User } from "../interfaces";
import UserModel from "../models/userModel";
import AppError from "../utils/appError";
import { createToken } from "../utils/jwtHandlers";

const getLoggedInUser = async (userId: string): Promise<User> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

const updateLoggedInUser = async (
  userId: string,
  userData: Partial<User>
): Promise<Auth> => {
  const { education, ...restUserData } = userData;

  const updatedUserData: Record<string, unknown> = { ...restUserData };

  if (education && Object.keys(education).length) {
    for (const [key, value] of Object.entries(education)) {
      updatedUserData[`education.${key}`] = value;
    }
  }

  const user = await UserModel.findByIdAndUpdate(userId, updatedUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Error while updating user"
    );
  }

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

const deleteLoggedInUser = async (
  userId: string
): Promise<{ message: string }> => {
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return { message: "User successfully deleted" };
};

export const UserServices = {
  getLoggedInUser,
  updateLoggedInUser,
  deleteLoggedInUser,
};
