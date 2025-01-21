"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const updateEducationSchema = zod_1.z.object({
    institute: zod_1.z.string().optional(),
    degree: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    batch: zod_1.z.string().optional(),
    roll: zod_1.z.string().optional(),
});
const updateUserSchema = zod_1.z.object({
    firstname: zod_1.z
        .string()
        .min(1, { message: "First name is required." })
        .optional(),
    lastname: zod_1.z.string().min(1, { message: "Last name is required." }).optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    sex: zod_1.z
        .enum(["male", "female", "other"], { message: "Sex is required." })
        .optional(),
    photo: zod_1.z
        .any()
        .refine((file) => file instanceof File, {
        message: "Image must be a file.",
    })
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
        message: "Date must be a valid date string.",
    })
        .transform((val) => new Date(val))
        .optional(),
    hobbies: zod_1.z.array(zod_1.z.string()).optional(),
    education: updateEducationSchema.optional(),
});
exports.UserValidations = {
    updateUserSchema,
};
