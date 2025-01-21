import { StatusCodes } from "http-status-codes";
import mongoose, { ObjectId } from "mongoose";
import Sentiment from "sentiment";
import { Comment } from "../interfaces";
import CommentModel from "../models/commentModel";
import UserModel from "../models/userModel";
import WorkshopModel from "../models/workshopModel";
import AppError from "../utils/appError";

const createComment = async (
  userId: ObjectId,
  workshopId: string,
  text: string
): Promise<Comment> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await UserModel.findById(userId).session(session);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const workshop = await WorkshopModel.findById(workshopId).session(session);

    if (!workshop) {
      throw new AppError(StatusCodes.NOT_FOUND, "Workshop not found");
    }

    const sentimentAnalyzer = new Sentiment();
    const sentimentResult = sentimentAnalyzer.analyze(text);
    const sentimentScore = sentimentResult.score;

    const comment = await CommentModel.create(
      [
        {
          text,
          sentiment: sentimentScore,
          user: user._id,
          workshop: workshop._id,
        },
      ],
      { session }
    );

    workshop.comments.push(comment[0]._id);
    user.comments.push(comment[0]._id);

    if (sentimentScore > 0) {
      user.points += 10;
    } else if (sentimentScore < 0) {
      if (user.points >= 10) {
        user.points -= 10;
      }
    } else {
      user.points += 5;
    }

    await workshop.save({ session });
    await user.save({ session });

    await session.commitTransaction();

    return comment[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const CommentServices = {
  createComment,
};
