import mongoose, { Schema } from "mongoose";
import { Education, User } from "../interfaces";

const educationSchema = new Schema<Education>(
  {
    institute: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    roll: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "member", "admin"],
      required: true,
    },
    photo: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    hobbies: {
      type: [String],
    },
    education: educationSchema,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    workshops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workshop",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
