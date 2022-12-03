import { addDays, format } from "date-fns";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import type { StudiesCurriculumModelT } from "~/DAO/studiesCurriculumDAO.server";
import type { registrationPeriodT } from "~/data/data";
import { gradingPeriodScaffold } from "~/data/data";
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

export const getIsCourseGradingOpen = (semester: CourseModelT["semester"], dateNow: Date) => {
  const month = dateNow.getMonth();
  if (
    month >= gradingPeriodScaffold.resit.startMonth &&
    month <= gradingPeriodScaffold.resit.endMonth
  ) {
    return true;
  } else if (
    semester % 2 === 0 &&
    month >= gradingPeriodScaffold.springSemester.startMonth &&
    month <= gradingPeriodScaffold.springSemester.endMonth
  ) {
    return true;
  } else if (
    month >= gradingPeriodScaffold.fallSemester.startMonth &&
    month <= gradingPeriodScaffold.fallSemester.endMonth
  ) {
    return true;
  }
  return false;
};

export const getIsAlreadyGraded = (dateNow: Date, latestGrading: Date | null) => {
  const month = dateNow.getMonth();
  const year = dateNow.getFullYear();

  if (!latestGrading) return false;
  if (year === latestGrading.getFullYear()) {
    if (month < 8 || latestGrading.getMonth() >= 8) {
      return true;
    }
  }
  return false;
};
