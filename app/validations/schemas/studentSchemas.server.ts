import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";

const studiesStatuses = z.enum(["UNDERGRADUATE", "POSTGRADUATE", "ALUM"]);
const enrollmentYear = z
  .string()
  .trim()
  .regex(/^[2-9]\d{3}$/, "Not a valid year");

export const newStudentSchema = z
  .object({
    dep: z.string(),
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string(),
    enrollmentYear: enrollmentYear,
    studiesStatus: studiesStatuses,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editStudentSchema = z.object({
  enrollmentYear: enrollmentYear,
  studiesStatus: studiesStatuses,
  redirectTo: z.string(),
});
