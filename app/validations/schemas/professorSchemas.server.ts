import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";

export const newProfessorSchema = z
  .object({
    dep: z.string(),
    username: usernameField,
    password: passwordField,
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
