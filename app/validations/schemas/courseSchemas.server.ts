import { z } from "zod";
import { checkboxField, titleField } from "../common/schemasCommon.server";

export const courseSchema = z
  .object({
    dep: z.string(),
    title: titleField,
    description: z.string().trim().min(1, "Description must be provided"),
    semester: z
      .string()
      .trim()
      .regex(/^[1-8]$/, "Invalid semester"),
    isCompulsory: checkboxField,
    isPostgraduate: checkboxField,
  })
  .refine((data) => (data.isPostgraduate === "on" ? !!data.semester.match(/^[1-4]$/) : true), {
    message: "Invalid semester",
    path: ["semester"],
  });
