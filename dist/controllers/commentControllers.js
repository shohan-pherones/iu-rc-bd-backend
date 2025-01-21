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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const commentServices_1 = require("../services/commentServices");
const catchAsync_1 = require("../utils/catchAsync");
const sendResponse_1 = require("../utils/sendResponse");
const createComment = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { workshopId } = req.params;
    const { userId } = req.user;
    const { text } = req.body;
    const comment = yield commentServices_1.CommentServices.createComment(userId, workshopId, text);
    (0, sendResponse_1.sendResponse)(res, http_status_codes_1.StatusCodes.CREATED, "Comment created successfully", comment);
}));
exports.CommentControllers = {
    createComment,
};
