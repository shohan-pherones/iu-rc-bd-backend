"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const userControllers_1 = require("../controllers/userControllers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const zodValidation_1 = require("../middlewares/zodValidation");
const multerUtils_1 = require("../utils/multerUtils");
const userValidations_1 = require("../validations/userValidations");
const router = express_1.default.Router();
router.get("/me", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user, constants_1.USER_ROLE.member, constants_1.USER_ROLE.admin), userControllers_1.UserControllers.getLoggedInUser);
router.put("/me", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user, constants_1.USER_ROLE.member, constants_1.USER_ROLE.admin), multerUtils_1.upload.single("photo"), (0, zodValidation_1.validate)(userValidations_1.UserValidations.updateUserSchema), userControllers_1.UserControllers.updateLoggedInUser);
router.delete("/me", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user, constants_1.USER_ROLE.member, constants_1.USER_ROLE.admin), userControllers_1.UserControllers.deleteLoggedInUser);
exports.default = router;
