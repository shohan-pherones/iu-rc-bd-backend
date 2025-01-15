import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import envConfig from "../config/envConfig";
import { UserRole } from "../interfaces";
import UserModel from "../models/userModel";
import AppError from "../utils/appError";
import { verifyToken } from "../utils/jwtHandlers";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const { userId, role } = verifyToken(
        token,
        envConfig.jwt_access_secret as string
      ) as JwtPayload;

      const user = await UserModel.findById(userId);

      if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found");
      }

      if (roles && !roles.includes(role)) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      req.user = { userId, role } as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
