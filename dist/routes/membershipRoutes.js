"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const membershipControllers_1 = require("../controllers/membershipControllers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const zodValidation_1 = require("../middlewares/zodValidation");
const membershipValidations_1 = require("../validations/membershipValidations");
const router = express_1.default.Router();
router.post("/apply", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user), (0, zodValidation_1.validate)(membershipValidations_1.MembershipValidations.membershipSchema), membershipControllers_1.MembershipControllers.applyForMembership);
router.delete("/cancel", (0, authMiddleware_1.default)(constants_1.USER_ROLE.member), (0, zodValidation_1.validate)(membershipValidations_1.MembershipValidations.membershipSchema), membershipControllers_1.MembershipControllers.cancelMembership);
exports.default = router;
