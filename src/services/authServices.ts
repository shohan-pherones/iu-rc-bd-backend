import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import envConfig from "../config/envConfig";
import { User } from "../interfaces";
import UserModel from "../models/userModel";
import AppError from "../utils/appError";
import { createToken } from "../utils/jwtHandlers";

const register = async (userData: User) => {
  const existingUser = await UserModel.findOne({ email: userData.email });

  if (existingUser) {
    throw new AppError(
      StatusCodes.CONFLICT,
      "User with this email already exists"
    );
  }

  const hashedPassword = await bcrypt.hash(userData.password, 12);

  const user = new UserModel({
    ...userData,
    password: hashedPassword,
  });

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

const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "User with this email does not exist"
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(StatusCodes.FORBIDDEN, "Incorrect password");
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

export const AuthServices = {
  register,
  login,
};
