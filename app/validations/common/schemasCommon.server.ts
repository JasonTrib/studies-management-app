import { z } from "zod";

export const fieldRegex = new RegExp(/^[\w\-' ]*$/);

export const checkboxField = z.string().regex(/^on$/).optional();
export const usernameField = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters long")
  .regex(fieldRegex, "Invalid input");
export const passwordField = z.string().min(4, "Password must be at least 4 characters long");
export const titleField = z
  .string()
  .trim()
  .min(1, "Title must be provided")
  .regex(fieldRegex, "Invalid input");
export const emailField = z.string().email().or(z.string().regex(/^$/));
export const telephoneField = z
  .string()
  .trim()
  .regex(/^\d{10}$|^$/, "Telephone must be 10 digits long");
