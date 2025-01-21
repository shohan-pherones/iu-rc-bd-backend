import { z } from "zod";

export const instructorSchema = z.object({
  name: z.string().min(1, "Instructor name is required."),
  photo: z.string().url().optional(),
  designation: z.string().min(1, "Instructor designation is required."),
});

export const workshopSchema = z.object({
  name: z.string().min(1, "Workshop name is required."),
  banner: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image must be a file.",
    })
    .optional(),
  description: z.string().min(1, "Workshop description is required."),
  host: z.string().min(1, "Workshop host is required."),
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid date string.",
    })
    .transform((val) => new Date(val)),
  maxAttendee: z.number().min(100, "Maximum attendees must be at least 100."),
  dateTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Date must be a valid date string.",
    })
    .transform((val) => new Date(val)),
  duration: z
    .number()
    .min(3, "Duration must be at least 3 hours.")
    .max(8, "Duration cannot exceed 8 hours."),
  instructors: z
    .array(instructorSchema)
    .min(1, "At least one instructor is required."),
});

export const WorkshopValidations = {
  workshopSchema,
};
