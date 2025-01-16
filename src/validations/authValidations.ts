import { z } from "zod";

const educationSchema = z.object({
  institute: z.string().min(1, { message: "Institute is required." }),
  degree: z.string().min(1, { message: "Degree is required." }),
  department: z.string().min(1, { message: "Department is required." }),
  batch: z.string().min(1, { message: "Batch is required." }),
  roll: z.string().min(1, { message: "Roll number is required." }),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(30, { message: "Username must be at most 30 characters long." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Username should only contain letters, numbers, and underscores.",
    }),
  firstname: z.string().min(1, { message: "First name is required." }),
  lastname: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
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
      message:
        "Password must contain at least one special character (!@#$%^&*).",
    }),
  phone: z.string().optional(),
  address: z.string().optional(),
  sex: z.enum(["male", "female", "other"], { message: "Sex is required." }),
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
  education: educationSchema,
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z
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
      message:
        "Password must contain at least one special character (!@#$%^&*).",
    }),
});

const refreshTokenSchema = z.string();

export const AuthValidations = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};
