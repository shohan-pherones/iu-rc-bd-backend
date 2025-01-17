import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { WorkshopServices } from "../services/workshopServices";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";

const getWorkshops = catchAsync(async (req: Request, res: Response) => {
  const workshops = await WorkshopServices.getWorkshops();

  sendResponse(res, StatusCodes.OK, "Workshops retrieved successfully", {
    workshops,
  });
});

const getWorkshop = catchAsync(async (req: Request, res: Response) => {
  const { workshopId } = req.params;

  const workshop = await WorkshopServices.getWorkshop(workshopId);

  sendResponse(res, StatusCodes.OK, "Workshop retrieved successfully", {
    workshop,
  });
});

export const WorkshopControllers = {
  getWorkshops,
  getWorkshop,
};
