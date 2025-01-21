import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CommentServices } from "../services/commentServices";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const { workshopId } = req.params;
  const { userId } = req.user;
  const { text } = req.body;

  const comment = await CommentServices.createComment(userId, workshopId, text);

  sendResponse(
    res,
    StatusCodes.CREATED,
    "Comment created successfully",
    comment
  );
});

export const CommentControllers = {
  createComment,
};
