import { Document } from "mongoose";
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
  hobbies?: string[];
  education: Education;
  comments: Comment[];
  workshops: Workshop[];
}

export interface Instructor extends Document {
  name: string;
  photo?: string;
  designation: string;
}

export interface Workshop extends Document {
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
  users: User[];
  comments: Comment[];
}

export interface Comment extends Document {
  text: string;
  user: User;
  workshop: Workshop;
}

export type UserRole = keyof typeof USER_ROLE;
