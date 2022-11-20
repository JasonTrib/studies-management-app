import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";
import { commonDepartmentCodeField, commonDepartmentFields } from "./departmentSchemas.server";

export const initSchema = z
  .object({
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string(),
    code: commonDepartmentCodeField,
    ...commonDepartmentFields,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: usernameField,
  password: passwordField,
});

export const editPasswordSchema = z
  .object({
    username: usernameField,
    oldPassword: z.string().min(1, "Required"),
    newPassword: passwordField,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
