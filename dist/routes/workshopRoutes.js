"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const workshopControllers_1 = require("../controllers/workshopControllers");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const zodValidation_1 = require("../middlewares/zodValidation");
const multerUtils_1 = require("../utils/multerUtils");
const workshopValidations_1 = require("../validations/workshopValidations");
const router = express_1.default.Router();
router.get("/", workshopControllers_1.WorkshopControllers.getWorkshops);
router.post("/", (0, authMiddleware_1.default)(constants_1.USER_ROLE.admin), multerUtils_1.upload.single("banner"), (0, zodValidation_1.validate)(workshopValidations_1.WorkshopValidations.workshopSchema), workshopControllers_1.WorkshopControllers.createWorkshop);
router.get("/:workshopId", workshopControllers_1.WorkshopControllers.getWorkshop);
router.put("/:workshopId", (0, authMiddleware_1.default)(constants_1.USER_ROLE.admin), multerUtils_1.upload.single("banner"), (0, zodValidation_1.validate)(workshopValidations_1.WorkshopValidations.workshopSchema), workshopControllers_1.WorkshopControllers.updateWorkshop);
router.delete("/:workshopId", (0, authMiddleware_1.default)(constants_1.USER_ROLE.admin), workshopControllers_1.WorkshopControllers.deleteWorkshop);
router.post("/:workshopId/register", (0, authMiddleware_1.default)(constants_1.USER_ROLE.user, constants_1.USER_ROLE.member), workshopControllers_1.WorkshopControllers.registerWorkshop);
exports.default = router;
