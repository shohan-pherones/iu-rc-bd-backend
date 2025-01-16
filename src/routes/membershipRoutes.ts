import express, { Router } from "express";
import { USER_ROLE } from "../constants";
import { MembershipControllers } from "../controllers/membershipControllers";
import auth from "../middlewares/authMiddleware";
import { validate } from "../middlewares/zodValidation";
import { MembershipValidations } from "../validations/membershipValidations";

const router: Router = express.Router();

router.post(
  "/apply",
  auth(USER_ROLE.user),
  validate(MembershipValidations.membershipSchema),
  MembershipControllers.applyForMembership
);

router.delete(
  "/cancel",
  auth(USER_ROLE.member),
  validate(MembershipValidations.membershipSchema),
  MembershipControllers.cancelMembership
);

export default router;
