"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const authServices_1 = require("../services/authServices");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = require("../utils/catchAsync");
const multerUtils_1 = require("../utils/multerUtils");
const sendResponse_1 = require("../utils/sendResponse");
const register = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageFile = req.file;
    if (!imageFile) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
    }
    const photo = yield (0, multerUtils_1.uploadImage)(imageFile);
    const { accessToken, refreshToken, user } = yield authServices_1.AuthServices.register(Object.assign(Object.assign({}, req.body), { photo }));
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.CREATED, "User registered successfully", {
        accessToken,
        refreshToken,
        user,
    });
}));
const login = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = yield authServices_1.AuthServices.login(email, password);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "User logged in successfully", {
        accessToken,
        refreshToken,
        user,
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers["x-refresh-token"];
    const { accessToken, refreshToken, user } = yield authServices_1.AuthServices.refreshToken(token);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "Access token retrieved successfully", {
        accessToken,
        refreshToken,
        user,
    });
}));
exports.AuthControllers = {
    register,
    login,
    refreshToken,
};
