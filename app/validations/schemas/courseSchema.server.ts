import { z } from "zod";

const courseSchema = z.object({
  dep: z.enum(["IT", "GEO"]),
  title: z.string().min(1, "Title must be provided"),
  description: z.string().min(1, "Description must be provided"),
  semester: z.string().regex(/^[1-8]$/, "Invalid semester"),
  isElective: z.string().regex(/on/).optional(),
  isPostgraduate: z.string().regex(/on/).optional(),
  isPublic: z.string().regex(/on/).optional(),
});

export default courseSchema;
