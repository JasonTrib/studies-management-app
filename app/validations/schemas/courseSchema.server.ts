import { z } from "zod";

export const courseSchema = z.object({
  dep: z.enum(["IT", "GEO"]),
  title: z
    .string()
    .trim()
    .min(1, "Title must be provided")
    .regex(/^[\w\- ]*$/, "Invalid input"),
  description: z.string().trim().min(1, "Description must be provided"),
  semester: z
    .string()
    .trim()
    .regex(/^[1-8]$/, "Invalid semester"),
  isElective: z.string().regex(/on/).optional(),
  isPostgraduate: z.string().regex(/on/).optional(),
  isPublic: z.string().regex(/on/).optional(),
});
