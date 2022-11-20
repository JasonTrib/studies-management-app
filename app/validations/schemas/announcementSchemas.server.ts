import { z } from "zod";
import { titleField } from "../common/schemasCommon.server";

export const newAnnouncementSchema = z.object({
  courseId: z.string().min(1),
  title: titleField,
  body: z.string().trim().min(1, "Body must be provided"),
});
