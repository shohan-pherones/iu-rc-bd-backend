"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const zod_1 = require("zod");
const educationSchema = zod_1.z.object({
    institute: zod_1.z.string().min(1, { message: "Institute is required." }),
    degree: zod_1.z.string().min(1, { message: "Degree is required." }),
    department: zod_1.z.string().min(1, { message: "Department is required." }),
    batch: zod_1.z.string().min(1, { message: "Batch is required." }),
    roll: zod_1.z.string().min(1, { message: "Roll number is required." }),
});
const registerSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username must be at most 30 characters long." })
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username should only contain letters, numbers, and underscores.",
    }),
    firstname: zod_1.z.string().min(1, { message: "First name is required." }),
    lastname: zod_1.z.string().min(1, { message: "Last name is required." }),
    email: zod_1.z.string().email({ message: "Invalid email format." }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
        .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
    })
        .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character (!@#$%^&*).",
    }),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    sex: zod_1.z.enum(["male", "female", "other"], { message: "Sex is required." }),
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
    education: educationSchema,
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email format." }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
    })
        .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
    })
        .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
    })
        .regex(/[!@#$%^&*]/, {
        message: "Password must contain at least one special character (!@#$%^&*).",
    }),
});
const refreshTokenSchema = zod_1.z.string();
exports.AuthValidations = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
};
