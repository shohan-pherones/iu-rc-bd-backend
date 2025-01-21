import express, { Router } from "express";
import { USER_ROLE } from "../constants";
import { WorkshopControllers } from "../controllers/workshopControllers";
import auth from "../middlewares/authMiddleware";
import { validate } from "../middlewares/zodValidation";
import { upload } from "../utils/multerUtils";
import { WorkshopValidations } from "../validations/workshopValidations";

const router: Router = express.Router();

router.get("/", WorkshopControllers.getWorkshops);

router.post(
  "/",
  auth(USER_ROLE.admin),
  upload.single("banner"),
  validate(WorkshopValidations.workshopSchema),
  WorkshopControllers.createWorkshop
);

router.get("/:workshopId", WorkshopControllers.getWorkshop);

router.put(
  "/:workshopId",
  auth(USER_ROLE.admin),
  upload.single("banner"),
  validate(WorkshopValidations.workshopSchema),
  WorkshopControllers.updateWorkshop
);

router.delete(
  "/:workshopId",
  auth(USER_ROLE.admin),
  WorkshopControllers.deleteWorkshop
);

router.post(
  "/:workshopId/register",
  auth(USER_ROLE.user, USER_ROLE.member),
  WorkshopControllers.registerWorkshop
);

export default router;
