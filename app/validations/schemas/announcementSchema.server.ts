import { z } from "zod";

export const newAnnouncementSchema = z.object({
  courseId: z.string().min(1),
  title: z
    .string()
    .trim()
    .min(1, "Title must be provided")
    .regex(/^[\w ]*$/, "Invalid input"),
  body: z.string().trim().min(1, "Body must be provided"),
});
