import { z } from "zod";

const professorSchema = z
  .object({
    dep: z.enum(["IT", "GEO"]),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[\w]*$/, "Invalid input"),
    password: z.string().min(4, "Password must be at least 4 characters long"),
    confirmPassword: z.string(),
    title: z.enum([
      "Lecturer",
      "Assistant Professor",
      "Associate Professor",
      "Professor",
      "Emeritus Professor",
    ]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default professorSchema;
