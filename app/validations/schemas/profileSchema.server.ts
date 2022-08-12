import { z } from "zod";

const profileSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().or(z.string().regex(/^$/)),
  fullname: z
    .string()
    .trim()
    .regex(/^[\w ]*$/, "Invalid input"),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$|^$/, "Phone must be 10 digits long"),
  info: z.string().trim(),
  avatar: z.string().trim().optional(),
  isPublic: z.string().regex(/^on$/).optional(),
});

export default profileSchema;
