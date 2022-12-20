import type { StudiesCurriculum } from "@prisma/client";

const undergrad_curriculum = [
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 0 } },
];

const postgrad_curriculum = [
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
];

export const registration_periods = {
  fallSemester: {
    startDate: new Date(`${new Date().getFullYear()}-10-10`).toISOString(),
    endDate: new Date(`${new Date().getFullYear()}-10-30`).toISOString(),
  },
  springSemester: {
    startDate: new Date(`${new Date().getFullYear()}-3-13`).toISOString(),
    endDate: new Date(`${new Date().getFullYear()}-4-02`).toISOString(),
  },
};

export const studiesCurriculums: {
  depId: StudiesCurriculum["dep_id"];
  undergrad: StudiesCurriculum["undergrad"];
  postgrad: StudiesCurriculum["postgrad"];
  registrationPeriods: StudiesCurriculum["registration_periods"];
}[] = [
  {
    depId: "IT",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
    registrationPeriods: registration_periods,
  },
  {
    depId: "GEO",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
    registrationPeriods: registration_periods,
  },
  {
    depId: "NSD",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
    registrationPeriods: registration_periods,
  },
];
