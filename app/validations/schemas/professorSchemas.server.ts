import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";

const professorTitle = z.enum([
  "Lecturer",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Emeritus Professor",
]);

export const newProfessorSchema = z
  .object({
    dep: z.string(),
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string(),
    title: professorTitle,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editProfessorSchema = z.object({
  title: professorTitle,
  redirectTo: z.string(),
});
