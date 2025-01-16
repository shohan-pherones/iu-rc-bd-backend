import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import envConfig from "../config/envConfig";
import { Auth, User } from "../interfaces";
import UserModel from "../models/userModel";
import AppError from "../utils/appError";
import { createToken, verifyToken } from "../utils/jwtHandlers";

const register = async (userData: User): Promise<Auth> => {
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

const login = async (email: string, password: string): Promise<Auth> => {
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

const refreshToken = async (token: string): Promise<Auth> => {
  try {
    const { userId } = verifyToken(
      token,
      envConfig.jwt_refresh_secret as string
    );

    if (!userId) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token payload");
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
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

    return { accessToken, refreshToken: token, user };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong during token refresh"
    );
  }
};

export const AuthServices = {
  register,
  login,
  refreshToken,
};
