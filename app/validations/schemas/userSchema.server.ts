import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^[\w]*$/, "Invalid input"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export const editPasswordSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[\w]*$/, "Invalid input"),
    oldPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(4, "Password must be at least 4 characters long"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
