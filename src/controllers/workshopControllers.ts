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

const createWorkshop = catchAsync(async (req: Request, res: Response) => {
  // const imageFile = req.file as Express.Multer.File;

  // if (!imageFile) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "Image is required");
  // }

  // const banner = await uploadImage(imageFile);

  const workshop = await WorkshopServices.createWorkshop({
    ...req.body,
    // banner,
  });

  sendResponse(res, StatusCodes.CREATED, "Workshop created successfully", {
    workshop,
  });
});

const updateWorkshop = catchAsync(async (req: Request, res: Response) => {
  const { workshopId } = req.params;

  // const imageFile = req.file as Express.Multer.File;

  // if (!imageFile) {
  //   throw new AppError(StatusCodes.BAD_REQUEST, "Image is required");
  // }

  // const banner = await uploadImage(imageFile);

  const workshop = await WorkshopServices.updateWorkshop(workshopId, {
    ...req.body,
    // banner,
  });

  sendResponse(res, StatusCodes.OK, "Workshop updated successfully", {
    workshop,
  });
});

const deleteWorkshop = catchAsync(async (req: Request, res: Response) => {
  const { workshopId } = req.params;

  const { message } = await WorkshopServices.deleteWorkshop(workshopId);

  sendResponse(res, StatusCodes.OK, message, null);
});

export const WorkshopControllers = {
  getWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
};
