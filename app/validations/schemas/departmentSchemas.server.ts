import { z } from "zod";
import { emailField, telephoneField, titleField } from "../common/schemasCommon.server";

export const commonDepartmentCodeField = z
  .string()
  .min(2, "Code must be at least 2 characters long")
  .max(4, "Code must be at most 4 characters long");
export const commonDepartmentFields = {
  title: titleField,
  description: z.string().trim(),
  address: z.string().trim(),
  email: emailField,
  telephone: telephoneField,
  foundationDate: z.string(),
};

export const editDepartmentSchema = z.object({
  dep: z.string(),
  ...commonDepartmentFields,
});

export const newDepartmentSchema = z.object({
  code: commonDepartmentCodeField,
  ...commonDepartmentFields,
});
