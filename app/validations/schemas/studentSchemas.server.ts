import { z } from "zod";
import { passwordField, usernameField } from "../common/schemasCommon.server";

export const newStudentSchema = z
  .object({
    dep: z.string(),
    username: usernameField,
    password: passwordField,
    confirmPassword: z.string(),
    enrollmentYear: z
      .string()
      .trim()
      .regex(/^[2-9]\d{3}$/, "Not a valid year"),
    studiesStatus: z.enum(["UNDERGRADUATE", "POSTGRADUATE", "ALUM"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
