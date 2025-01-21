"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidations = void 0;
const zod_1 = require("zod");
const commentTextSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .min(1, "Comment text cannot be empty")
        .max(500, "Comment text cannot exceed 500 characters"),
});
exports.CommentValidations = {
    commentTextSchema,
};
