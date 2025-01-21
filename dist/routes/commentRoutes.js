"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const commentControllers_1 = require("../controllers/commentControllers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const zodValidation_1 = require("../middlewares/zodValidation");
const commentValidations_1 = require("../validations/commentValidations");
const router = express_1.default.Router();
router.post("/:workshopId/create", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user, constants_1.USER_ROLE.member), (0, zodValidation_1.validate)(commentValidations_1.CommentValidations.commentTextSchema), commentControllers_1.CommentControllers.createComment);
exports.default = router;
