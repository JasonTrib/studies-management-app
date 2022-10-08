import { z } from "zod";

export const editDepartmentSchema = z.object({
  dep: z.enum(["IT", "GEO"]),
  title: z
    .string()
    .trim()
    .min(1, "Title must be provided")
    .regex(/^[\w\- ]*$/, "Invalid input"),
  address: z.string().trim(),
  description: z.string().trim(),
  email: z.string().email().or(z.string().regex(/^$/)),
  telephone: z
    .string()
    .trim()
    .regex(/^\d{10}$|^$/, "Telephone must be 10 digits long"),
  foundationDate: z.string(),
});
