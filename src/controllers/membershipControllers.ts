import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MembershipServices } from "../services/membershipServices";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const applyForMembership = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { volunteerPass } = req.body;

  const { accessToken, refreshToken, user } =
    await MembershipServices.applyForMembership(userId, volunteerPass);

  sendResponse(
    res,
    StatusCodes.OK,
    "Congratulations! You are now a valued member of our community.",
    {
      accessToken,
      refreshToken,
      user,
    }
  );
});

const cancelMembership = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { volunteerPass } = req.body;

  const { accessToken, refreshToken, user } =
    await MembershipServices.cancelMembership(userId, volunteerPass);

  sendResponse(
    res,
    StatusCodes.OK,
    "Your membership has been successfully canceled.",
    {
      accessToken,
      refreshToken,
      user,
    }
  );
});

export const MembershipControllers = {
  applyForMembership,
  cancelMembership,
};
