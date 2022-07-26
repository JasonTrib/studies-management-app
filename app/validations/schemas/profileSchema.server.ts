import { z } from "zod";

const courseSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().or(z.string().regex(/^$/)),
  name: z.string(),
  surname: z.string(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  phone: z.string().regex(/^\d{10}$|^$/, "Phone must be 10 digits long"),
  info: z.string(),
  avatar: z.string().optional(),
  isPublic: z.string().regex(/^on$/).optional(),
});

export default courseSchema;
