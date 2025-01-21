import express, { Router } from "express";
import { USER_ROLE } from "../constants";
import { CommentControllers } from "../controllers/commentControllers";
import auth from "../middlewares/authMiddleware";
import { validate } from "../middlewares/zodValidation";
import { CommentValidations } from "../validations/commentValidations";

const router: Router = express.Router();

router.post(
  "/:workshopId/create",
  auth(USER_ROLE.user, USER_ROLE.member),
  validate(CommentValidations.commentTextSchema),
  CommentControllers.createComment
);

export default router;
