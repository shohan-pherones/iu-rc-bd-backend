"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const zodValidation_1 = require("../middlewares/zodValidation");
const multerUtils_1 = require("../utils/multerUtils");
const authValidations_1 = require("../validations/authValidations");
const router = express_1.default.Router();
router.post("/register", multerUtils_1.upload.single("photo"), (0, zodValidation_1.validate)(authValidations_1.AuthValidations.registerSchema), authControllers_1.AuthControllers.register);
router.post("/login", (0, zodValidation_1.validate)(authValidations_1.AuthValidations.loginSchema), authControllers_1.AuthControllers.login);
router.post("/token/refresh", (0, zodValidation_1.validate)(authValidations_1.AuthValidations.refreshTokenSchema), authControllers_1.AuthControllers.refreshToken);
exports.default = router;
