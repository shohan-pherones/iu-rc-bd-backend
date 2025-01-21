"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkshopValidations = exports.workshopSchema = exports.instructorSchema = void 0;
const zod_1 = require("zod");
exports.instructorSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Instructor name is required."),
    photo: zod_1.z.string().url().optional(),
    designation: zod_1.z.string().min(1, "Instructor designation is required."),
});
exports.workshopSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Workshop name is required."),
    banner: zod_1.z
        .any()
        .refine((file) => file instanceof File, {
        message: "Image must be a file.",
    })
        .optional(),
    description: zod_1.z.string().min(1, "Workshop description is required."),
    host: zod_1.z.string().min(1, "Workshop host is required."),
    deadline: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Date must be a valid date string.",
    })
        .transform((val) => new Date(val)),
    maxAttendee: zod_1.z.number().min(100, "Maximum attendees must be at least 100."),
    dateTime: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Date must be a valid date string.",
    })
        .transform((val) => new Date(val)),
    duration: zod_1.z
        .number()
        .min(3, "Duration must be at least 3 hours.")
        .max(8, "Duration cannot exceed 8 hours."),
    instructors: zod_1.z
        .array(exports.instructorSchema)
        .min(1, "At least one instructor is required."),
});
exports.WorkshopValidations = {
    workshopSchema: exports.workshopSchema,
};
