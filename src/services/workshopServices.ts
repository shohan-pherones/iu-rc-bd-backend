import { StatusCodes } from "http-status-codes";
import { Workshop } from "../interfaces";
import WorkshopModel from "../models/workshopModel";
import AppError from "../utils/appError";

const getWorkshops = async (): Promise<Workshop[]> => {
  const workshops = await WorkshopModel.find();

  return workshops;
};

const getWorkshop = async (workshopId: string): Promise<Workshop> => {
  const workshop = await WorkshopModel.findById(workshopId);

  if (!workshop) {
    throw new AppError(StatusCodes.NOT_FOUND, "Workshop not found");
  }

  return workshop;
};

export const WorkshopServices = {
  getWorkshops,
  getWorkshop,
};
