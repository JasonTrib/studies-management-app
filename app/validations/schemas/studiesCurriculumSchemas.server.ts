import { z } from "zod";
import { getMonth, getYear } from "date-fns";

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

export const registrationPeriodsSchema = z
  .object({
    fallSemesterStart: z.date(),
    fallSemesterEnd: z.date(),
    springSemesterStart: z.date(),
    springSemesterEnd: z.date(),
  })
  .refine((data) => getMonth(data.fallSemesterStart) > 7, {
    message: "Must be from September to December",
    path: ["fallSemesterStart"],
  })
  .refine((data) => getMonth(data.fallSemesterEnd) > 7, {
    message: "Must be from September to December",
    path: ["fallSemesterEnd"],
  })
  .refine((data) => getYear(data.fallSemesterStart) === getYear(new Date()), {
    message: "Date too far into the future",
    path: ["fallSemesterStart"],
  })
  .refine((data) => getYear(data.fallSemesterStart) === getYear(data.fallSemesterEnd), {
    message: "Year doesn't match",
    path: ["fallSemesterEnd"],
  })
  .refine((data) => data.fallSemesterStart.getTime() <= data.fallSemesterEnd.getTime(), {
    message: "Deadline is set before start",
    path: ["fallSemesterEnd"],
  })
  .refine(
    (data) => getMonth(data.springSemesterStart) > 0 && getMonth(data.springSemesterEnd) < 5,
    {
      message: "Must be from February to May",
      path: ["springSemesterStart"],
    },
  )
  .refine((data) => getMonth(data.springSemesterEnd) > 0 && getMonth(data.springSemesterEnd) < 5, {
    message: "Must be from February to May",
    path: ["springSemesterEnd"],
  })
  .refine(
    (data) => {
      if (getYear(data.springSemesterStart) <= getYear(new Date())) {
        return true;
      }
      if (getYear(data.springSemesterStart) === getYear(new Date()) + 1) {
        if (getMonth(data.springSemesterStart) < 5 && getYear(data.springSemesterStart)) {
          return true;
        }
      }
      return false;
    },
    {
      message: "Date too far into the future",
      path: ["springSemesterStart"],
    },
  )
  .refine((data) => getYear(data.springSemesterStart) === getYear(data.springSemesterEnd), {
    message: "Year doesn't match",
    path: ["springSemesterEnd"],
  })
  .refine((data) => data.springSemesterStart.getTime() <= data.springSemesterEnd.getTime(), {
    message: "Deadline is set before start",
    path: ["springSemesterEnd"],
  });
