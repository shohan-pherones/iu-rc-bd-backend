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
exports.MembershipServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = __importDefault(require("../config/envConfig"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const jwtHandlers_1 = require("../utils/jwtHandlers");
const applyForMembership = (userId, volunteerPass) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield userModel_1.default.findById(userId).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        const createdAt = new Date(user.createdAt);
        const now = new Date();
        const daysDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysDifference < 30) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User must be at least 30 days old to apply for membership.");
        }
        if (user.workshops.length < 5) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User must have joined at least 5 workshops to apply for membership.");
        }
        if (user.points < 500) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User must have at least 500 points to apply for membership.");
        }
        if (user.comments.length < 5) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_ACCEPTABLE, "User must have made at least 5 comments to apply for membership.");
        }
        if (volunteerPass !== envConfig_1.default.volunteer_pass) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid volunteer pass provided.");
        }
        if (user.role === "member") {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You are already a member.");
        }
        user.role = "member";
        user.points -= 250;
        yield user.save({ session });
        const jwtPayload = {
            userId: user.id,
            role: user.role,
        };
        const accessToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_access_secret, envConfig_1.default.jwt_access_expires_in);
        const refreshToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_refresh_secret, envConfig_1.default.jwt_refresh_expires_in);
        yield session.commitTransaction();
        return { accessToken, refreshToken, user };
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const cancelMembership = (userId, volunteerPass) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    if (volunteerPass !== envConfig_1.default.volunteer_pass) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid volunteer pass provided.");
    }
    user.role = "user";
    yield user.save();
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_access_secret, envConfig_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_refresh_secret, envConfig_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
exports.MembershipServices = {
    applyForMembership,
    cancelMembership,
};
