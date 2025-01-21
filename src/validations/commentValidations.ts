import { z } from "zod";

const commentTextSchema = z.object({
  text: z
    .string()
    .min(1, "Comment text cannot be empty")
    .max(500, "Comment text cannot exceed 500 characters"),
});

export const CommentValidations = {
  commentTextSchema,
};
