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
