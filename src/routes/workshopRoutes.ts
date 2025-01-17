import express, { Router } from "express";
import { WorkshopControllers } from "../controllers/workshopControllers";

const router: Router = express.Router();

router.get("/", WorkshopControllers.getWorkshops);

router.get("/:workshopId", WorkshopControllers.getWorkshop);

export default router;
