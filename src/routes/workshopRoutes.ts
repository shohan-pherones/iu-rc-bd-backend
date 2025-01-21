import express, { Router } from "express";
import { WorkshopControllers } from "../controllers/workshopControllers";
import auth from "../middlewares/authMiddleware";
import { USER_ROLE } from "../constants";
import { upload } from "../utils/multerUtils";
import { validate } from "../middlewares/zodValidation";
import { WorkshopValidations } from "../validations/workshopValidations";

const router: Router = express.Router();

router.get("/", WorkshopControllers.getWorkshops);

router.post(
  "/",
  auth(USER_ROLE.admin),
  // upload.single("banner"),
  validate(WorkshopValidations.workshopSchema),
  WorkshopControllers.createWorkshop
);

router.get("/:workshopId", WorkshopControllers.getWorkshop);

router.put(
  "/:workshopId",
  auth(USER_ROLE.admin),
  // upload.single("banner"),
  validate(WorkshopValidations.workshopSchema),
  WorkshopControllers.updateWorkshop
);

export default router;
