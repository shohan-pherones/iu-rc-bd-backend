import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthServices } from "../services/authServices";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const register = catchAsync(async (req: Request, res: Response) => {
  // const imageFile = req.file as Express.Multer.File;

  // if (!imageFile) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "Image is required");
  // }

  // const photo = await uploadImage(imageFile);

  const { accessToken, refreshToken, user } = await AuthServices.register({
    ...req.body,
    // photo,
  });

  sendResponse(res, StatusCodes.CREATED, "User registered successfully", {
    accessToken,
    refreshToken,
    user,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await AuthServices.login(
    email,
    password
  );

  sendResponse(res, StatusCodes.OK, "User logged in successfully", {
    accessToken,
    refreshToken,
    user,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers["x-refresh-token"] as string;

  const { accessToken, refreshToken, user } = await AuthServices.refreshToken(
    token
  );

  sendResponse(res, StatusCodes.OK, "Access token retrieved successfully", {
    accessToken,
    refreshToken,
    user,
  });
});

export const AuthControllers = {
  register,
  login,
  refreshToken,
};
