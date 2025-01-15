import mongoose, { Schema } from "mongoose";
import { Comment } from "../interfaces";

const commentSchema = new Schema<Comment>(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
