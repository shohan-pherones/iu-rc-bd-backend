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
exports.WorkshopServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const workshopModel_1 = __importDefault(require("../models/workshopModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const getWorkshops = () => __awaiter(void 0, void 0, void 0, function* () {
    const workshops = yield workshopModel_1.default.find();
    return workshops;
});
const getWorkshop = (workshopId) => __awaiter(void 0, void 0, void 0, function* () {
    const workshop = yield workshopModel_1.default.findById(workshopId);
    if (!workshop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Workshop not found");
    }
    return workshop;
});
const createWorkshop = (workshopData) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    if (new Date(workshopData.deadline) <= currentTime) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The deadline must be in the future.");
    }
    if (workshopData.maxAttendee < 100) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The maximum attendees must be at least 100.");
    }
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    if (new Date(workshopData.dateTime) <= currentTime ||
        new Date(workshopData.dateTime).getTime() <
            new Date(workshopData.deadline).getTime() + threeDaysInMillis) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop date must be at least 3 days after the deadline and in the future.");
    }
    if (workshopData.duration < 3 || workshopData.duration > 8) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop duration must be between 3 and 8 hours.");
    }
    if (!workshopData.instructors || workshopData.instructors.length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop must have at least one instructor.");
    }
    const workshop = new workshopModel_1.default(workshopData);
    yield workshop.save();
    return workshop;
});
const updateWorkshop = (workshopId, workshopData) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    if (new Date(workshopData.deadline) <= currentTime) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The deadline must be in the future.");
    }
    if (workshopData.maxAttendee < 100) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The maximum attendees must be at least 100.");
    }
    const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
    if (new Date(workshopData.dateTime) <= currentTime ||
        new Date(workshopData.dateTime).getTime() <
            new Date(workshopData.deadline).getTime() + threeDaysInMillis) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop date must be at least 3 days after the deadline and in the future.");
    }
    if (workshopData.duration < 3 || workshopData.duration > 8) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop duration must be between 3 and 8 hours.");
    }
    if (!workshopData.instructors || workshopData.instructors.length === 0) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The workshop must have at least one instructor.");
    }
    const workshop = yield workshopModel_1.default.findByIdAndUpdate(workshopId, workshopData, {
        new: true,
        runValidators: true,
    });
    if (!workshop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error while updating workshop");
    }
    return workshop;
});
const deleteWorkshop = (workshopId) => __awaiter(void 0, void 0, void 0, function* () {
    const workshop = yield workshopModel_1.default.findByIdAndDelete(workshopId);
    if (!workshop) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Workshop not found");
    }
    return { message: "Workshop successfully deleted" };
});
const registerWorkshop = (workshopId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const workshop = yield workshopModel_1.default.findById(workshopId).session(session);
        if (!workshop) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Workshop not found");
        }
        const isUserRegistered = workshop.users.find((user) => user.toString() === userId.toString());
        if (isUserRegistered) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User already registered for this workshop");
        }
        if (workshop.status !== "upcoming") {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cannot register for a workshop that is not upcoming");
        }
        if (workshop.users.length >= workshop.maxAttendee) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Workshop is fully booked");
        }
        const user = yield userModel_1.default.findById(userId).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        workshop.users.push(userId);
        user.workshops.push(workshop._id);
        if (user.role === "member") {
            user.points += 250;
        }
        else {
            user.points += 100;
        }
        yield workshop.save({ session });
        yield user.save({ session });
        yield session.commitTransaction();
        return { message: "Successfully registered for the workshop" };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.WorkshopServices = {
    getWorkshops,
    getWorkshop,
    createWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registerWorkshop,
};
