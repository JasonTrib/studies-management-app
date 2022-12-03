import type { UserModelT } from "~/DAO/userDAO.server";

export const USER_ROLE: {
  [key in UserModelT["role"]]: UserModelT["role"];
} = {
  SUPERADMIN: "SUPERADMIN",
  REGISTRAR: "REGISTRAR",
  PROFESSOR: "PROFESSOR",
  STUDENT: "STUDENT",
};

export type studiesCoursesDataT = { semester: { compulsories: number; electives: number } }[];
export type curriculumDataT = { semester: { electives: number } }[];

export const registrationPeriodScaffold = {
  fallSemester: {
    startDate: "",
    endDate: "",
  },
  springSemester: {
    startDate: "",
    endDate: "",
  },
};
export type registrationPeriodT = typeof registrationPeriodScaffold;

export const gradingPeriodScaffold = {
  fallSemester: {
    startMonth: 1,
    endMonth: 2,
  },
  springSemester: {
    startMonth: 5,
    endMonth: 6,
  },
  resit: {
    startMonth: 8,
    endMonth: 9,
  },
};
export type gradingPeriodT = typeof gradingPeriodScaffold;
