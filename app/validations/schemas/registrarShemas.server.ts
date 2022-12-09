import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";

export const newRegistrarSchema = z
  .object({
    dep: z.string(),
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string(),
    title: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editRegistrarSchema = z.object({
  title: z.string(),
  redirectTo: z.string(),
});
