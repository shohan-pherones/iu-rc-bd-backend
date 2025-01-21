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
exports.WorkshopControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const workshopServices_1 = require("../services/workshopServices");
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = require("../utils/catchAsync");
const multerUtils_1 = require("../utils/multerUtils");
const sendResponse_1 = require("../utils/sendResponse");
const getWorkshops = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const workshops = yield workshopServices_1.WorkshopServices.getWorkshops();
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "Workshops retrieved successfully", {
        workshops,
    });
}));
const getWorkshop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workshopId } = req.params;
    const workshop = yield workshopServices_1.WorkshopServices.getWorkshop(workshopId);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "Workshop retrieved successfully", {
        workshop,
    });
}));
const createWorkshop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageFile = req.file;
    if (!imageFile) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
    }
    const banner = yield (0, multerUtils_1.uploadImage)(imageFile);
    const workshop = yield workshopServices_1.WorkshopServices.createWorkshop(Object.assign(Object.assign({}, req.body), { banner }));
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.CREATED, "Workshop created successfully", {
        workshop,
    });
}));
const updateWorkshop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workshopId } = req.params;
    const imageFile = req.file;
    if (!imageFile) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
    }
    const banner = yield (0, multerUtils_1.uploadImage)(imageFile);
    const workshop = yield workshopServices_1.WorkshopServices.updateWorkshop(workshopId, Object.assign(Object.assign({}, req.body), { banner }));
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, "Workshop updated successfully", {
        workshop,
    });
}));
const deleteWorkshop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workshopId } = req.params;
    const { message } = yield workshopServices_1.WorkshopServices.deleteWorkshop(workshopId);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, message, null);
}));
const registerWorkshop = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workshopId } = req.params;
    const { userId } = req.user;
    const { message } = yield workshopServices_1.WorkshopServices.registerWorkshop(workshopId, userId);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.OK, message, null);
}));
exports.WorkshopControllers = {
    getWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registerWorkshop,
};
