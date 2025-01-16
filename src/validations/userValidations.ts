import { z } from "zod";

const updateEducationSchema = z.object({
  institute: z.string().optional(),
  degree: z.string().optional(),
  department: z.string().optional(),
  batch: z.string().optional(),
  roll: z.string().optional(),
});

const updateUserSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "First name is required." })
    .optional(),
  lastname: z.string().min(1, { message: "Last name is required." }).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  sex: z
    .enum(["male", "female", "other"], { message: "Sex is required." })
    .optional(),
  photo: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image must be a file.",
    })
    .optional(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid date string.",
    })
    .transform((val) => new Date(val))
    .optional(),
  hobbies: z.array(z.string()).optional(),
  education: updateEducationSchema.optional(),
});

export const UserValidations = {
  updateUserSchema,
};
