import { z } from "zod";

export const initSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[\w]*$/, "Invalid input"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    confirmPassword: z.string(),
    code: z
      .string()
      .min(2, "Code must be at least 2 characters long")
      .max(4, "Code must be at most 4 characters long"),
    title: z
      .string()
      .trim()
      .min(1, "Title must be provided")
      .regex(/^[\w\- ]*$/, "Invalid input"),
    description: z.string().trim(),
    address: z.string().trim(),
    email: z.string().email().or(z.string().regex(/^$/)),
    telephone: z
      .string()
      .trim()
      .regex(/^\d{10}$|^$/, "Telephone must be 10 digits long"),
    foundationDate: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
