import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any
) => {
  const response = {
    message,
    data,
  };
  res.status(statusCode).json(response);
};
