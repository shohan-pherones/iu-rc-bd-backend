import express, { Router } from "express";
import { USER_ROLE } from "../constants";
import { UserControllers } from "../controllers/userControllers";
import auth from "../middlewares/authMiddleware";
import { validate } from "../middlewares/zodValidation";
import { upload } from "../utils/multerUtils";
import { UserValidations } from "../validations/userValidations";

const router: Router = express.Router();

router.get(
  "/me",
  auth(USER_ROLE.user, USER_ROLE.member, USER_ROLE.admin),
  UserControllers.getLoggedInUser
);

router.put(
  "/me",
  auth(USER_ROLE.user, USER_ROLE.member, USER_ROLE.admin),
  upload.single("photo"),
  validate(UserValidations.updateUserSchema),
  UserControllers.updateLoggedInUser
);

router.delete(
  "/me",
  auth(USER_ROLE.user, USER_ROLE.member, USER_ROLE.admin),
  UserControllers.deleteLoggedInUser
);

export default router;
