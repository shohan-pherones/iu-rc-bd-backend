import mongoose, { Schema } from "mongoose";
import { Instructor, Workshop } from "../interfaces";

const instructorSchema = new Schema<Instructor>({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
  },
});

const workshopSchema = new Schema<Workshop>(
  {
    name: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    maxAttendee: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "running", "past"],
      required: true,
    },
    instructors: [instructorSchema],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const WorkshopModel = mongoose.model<Workshop>("Workshop", workshopSchema);

export default WorkshopModel;
