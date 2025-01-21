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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const envConfig_1 = __importDefault(require("../config/envConfig"));
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const jwtHandlers_1 = require("../utils/jwtHandlers");
const getLoggedInUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
});
const updateLoggedInUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { education } = userData, restUserData = __rest(userData, ["education"]);
    const updatedUserData = Object.assign({}, restUserData);
    if (education && Object.keys(education).length) {
        for (const [key, value] of Object.entries(education)) {
            updatedUserData[`education.${key}`] = value;
        }
    }
    const user = yield userModel_1.default.findByIdAndUpdate(userId, updatedUserData, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Error while updating user");
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_access_secret, envConfig_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwtHandlers_1.createToken)(jwtPayload, envConfig_1.default.jwt_refresh_secret, envConfig_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
const deleteLoggedInUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findByIdAndDelete(userId);
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return { message: "User successfully deleted" };
});
exports.UserServices = {
    getLoggedInUser,
    updateLoggedInUser,
    deleteLoggedInUser,
};
