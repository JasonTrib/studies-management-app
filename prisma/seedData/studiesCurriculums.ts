import type { StudiesCurriculum } from "@prisma/client";

const undergrad_curriculum = [
  { semester: { electives: 0 } },
  { semester: { electives: 0 } },
  { semester: { electives: 2 } },
  { semester: { electives: 2 } },
  { semester: { electives: 2 } },
  { semester: { electives: 3 } },
  { semester: { electives: 3 } },
  { semester: { electives: 4 } },
];

const postgrad_curriculum = [
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
  { semester: { electives: 1 } },
];

export const studiesCurriculums: {
  depId: StudiesCurriculum["dep_id"];
  undergrad: StudiesCurriculum["undergrad"];
  postgrad: StudiesCurriculum["postgrad"];
}[] = [
  {
    depId: "IT",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
  },
  {
    depId: "GEO",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
  },
  {
    depId: "NSD",
    undergrad: undergrad_curriculum,
    postgrad: postgrad_curriculum,
  },
];
