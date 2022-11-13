import { addDays, format } from "date-fns";
import type { StudiesCurriculumModelT } from "~/DAO/studiesCurriculumDAO.server";
import type { registrationPeriodT } from "~/data/data";
import { registrationPeriodScaffold } from "~/data/data";

export const paramToInt = (param: string | undefined): number | null => {
  if (param === undefined) return null;
  if (!param.match(/^\d+$/)) return null;

  return parseInt(param);
};

export const isObject = (value: unknown) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return true;
  }
  return false;
};

export const getCurrentRegistration = (
  studiesCurriculum: StudiesCurriculumModelT | null,
  dateNow: Date,
) => {
  let registrationPeriods = registrationPeriodScaffold;
  if (isObject(studiesCurriculum?.registration_periods)) {
    registrationPeriods = studiesCurriculum?.registration_periods as registrationPeriodT;
  }
  const dateStringNow = dateNow.toISOString();

  const isFallRegistration =
    format(new Date(registrationPeriods.fallSemester.startDate), "yyyy-MM-dd") < dateStringNow &&
    dateStringNow <
      format(addDays(new Date(registrationPeriods.fallSemester.endDate), 1), "yyyy-MM-dd");
  const isSpringRegistration =
    format(new Date(registrationPeriods.springSemester.startDate), "yyyy-MM-dd") < dateStringNow &&
    dateStringNow <
      format(addDays(new Date(registrationPeriods.springSemester.endDate), 1), "yyyy-MM-dd");

  return { isFallRegistration, isSpringRegistration };
};
