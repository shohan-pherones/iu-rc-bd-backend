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
exports.UserControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const userServices_1 = require("../services/userServices");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = require("../utils/catchAsync");
const multerUtils_1 = require("../utils/multerUtils");
const sendResponse_1 = require("../utils/sendResponse");
const getLoggedInUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const user = yield userServices_1.UserServices.getLoggedInUser(userId);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "User retrieved successfully", { user });
}));
const updateLoggedInUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const imageFile = req.file;
    if (!imageFile) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
    }
    const photo = yield (0, multerUtils_1.uploadImage)(imageFile);
    const user = yield userServices_1.UserServices.updateLoggedInUser(userId, Object.assign(Object.assign({}, req.body), { photo }));
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "User updated successfully", {
        user,
    });
}));
const deleteLoggedInUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const { message } = yield userServices_1.UserServices.deleteLoggedInUser(userId);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, message, null);
}));
exports.UserControllers = {
    getLoggedInUser,
    updateLoggedInUser,
    deleteLoggedInUser,
};
