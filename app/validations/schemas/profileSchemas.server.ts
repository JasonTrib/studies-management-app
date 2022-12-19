import { z } from "zod";
import {
  checkboxField,
  emailField,
  nameFieldRegex,
  telephoneField,
} from "../common/schemasCommon.server";

export const editProfileSchema = z.object({
  userId: z.string().min(1),
  email: emailField,
  fullname: z.string().trim().regex(nameFieldRegex, "Invalid input"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  phone: telephoneField,
  info: z.string().trim(),
  isPublic: checkboxField,
});
