"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, message, data) => {
    const response = {
        message,
        data,
    };
    res.status(statusCode).json(response);
};
exports.sendResponse = sendResponse;
