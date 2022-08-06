import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(4, "Password must be at least 4 characters long"),
});

export default userSchema;
