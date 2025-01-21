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
exports.CommentServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const sentiment_1 = __importDefault(require("sentiment"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const workshopModel_1 = __importDefault(require("../models/workshopModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const createComment = (userId, workshopId, text) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield userModel_1.default.findById(userId).session(session);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        const workshop = yield workshopModel_1.default.findById(workshopId).session(session);
        if (!workshop) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Workshop not found");
        }
        const sentimentAnalyzer = new sentiment_1.default();
        const sentimentResult = sentimentAnalyzer.analyze(text);
        const sentimentScore = sentimentResult.score;
        const comment = yield commentModel_1.default.create([
            {
                text,
                sentiment: sentimentScore,
                user: user._id,
                workshop: workshop._id,
            },
        ], { session });
        workshop.comments.push(comment[0]._id);
        user.comments.push(comment[0]._id);
        if (sentimentScore > 0) {
            user.points += 10;
        }
        else if (sentimentScore < 0) {
            if (user.points >= 10) {
                user.points -= 10;
            }
        }
        else {
            user.points += 5;
        }
        yield workshop.save({ session });
        yield user.save({ session });
        yield session.commitTransaction();
        return comment[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
exports.CommentServices = {
    createComment,
};
