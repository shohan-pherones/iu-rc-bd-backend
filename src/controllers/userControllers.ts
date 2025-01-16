import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "../services/userServices";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const getLoggedInUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const user = await UserServices.getLoggedInUser(userId);

  sendResponse(res, StatusCodes.OK, "User retrieved successfully", { user });
});

const updateLoggedInUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const user = await UserServices.updateLoggedInUser(userId, req.body);

  sendResponse(res, StatusCodes.OK, "User updated successfully", {
    user,
  });
});

const deleteLoggedInUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;

  const { message } = await UserServices.deleteLoggedInUser(userId);

  sendResponse(res, StatusCodes.OK, message, null);
});

export const UserControllers = {
  getLoggedInUser,
  updateLoggedInUser,
  deleteLoggedInUser,
};
