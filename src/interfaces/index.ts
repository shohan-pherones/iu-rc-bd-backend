import { Document, ObjectId } from "mongoose";
import { USER_ROLE } from "../constants";

export interface Education extends Document {
  institute: string;
  degree: string;
  department: string;
  batch: string;
  roll: string;
}

export interface User extends Document {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  sex: "male" | "female" | "other";
  role: "user" | "member" | "admin";
  photo?: string;
  dateOfBirth?: Date;
  points: number;
  createdAt: Date;
  education: Education;
  hobbies?: string[];
  comments: ObjectId[];
  workshops: ObjectId[];
}

export type UserRole = keyof typeof USER_ROLE;

export interface Auth {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Instructor extends Document {
  name: string;
  photo?: string;
  designation: string;
}

export interface Workshop extends Document {
  _id: ObjectId;
  name: string;
  banner?: string;
  description: string;
  host: string;
  deadline: Date;
  maxAttendee: number;
  dateTime: Date;
  duration: number;
  status: "upcoming" | "running" | "past";
  instructors: Instructor[];
  users: ObjectId[];
  comments: ObjectId[];
}

export interface Comment extends Document {
  _id: ObjectId;
  text: string;
  sentiment: number;
  user: ObjectId;
  workshop: ObjectId;
}
