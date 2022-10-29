import { z } from "zod";

const numberRegex = z.string().regex(/^\d+$/);

export const undergradCurriculumSchema = z.object({
  sem1: numberRegex,
  sem2: numberRegex,
  sem3: numberRegex,
  sem4: numberRegex,
  sem5: numberRegex,
  sem6: numberRegex,
  sem7: numberRegex,
  sem8: numberRegex,
});

export const postgradCurriculumSchema = z.object({
  sem1: numberRegex,
  sem2: numberRegex,
  sem3: numberRegex,
  sem4: numberRegex,
});
