import { z } from "zod";

const announcementSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(1, "Title must be provided"),
  body: z.string().min(1, "Body must be provided"),
});

export default announcementSchema;
