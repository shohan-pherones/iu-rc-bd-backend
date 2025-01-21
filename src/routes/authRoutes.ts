import express, { Router } from "express";
import { AuthControllers } from "../controllers/authControllers";
import { validate } from "../middlewares/zodValidation";
import { upload } from "../utils/multerUtils";
import { AuthValidations } from "../validations/authValidations";

const router: Router = express.Router();

router.post(
  "/register",
  upload.single("photo"),
  validate(AuthValidations.registerSchema),
  AuthControllers.register
);

router.post(
  "/login",
  validate(AuthValidations.loginSchema),
  AuthControllers.login
);

router.post(
  "/token/refresh",
  validate(AuthValidations.refreshTokenSchema),
  AuthControllers.refreshToken
);

export default router;
