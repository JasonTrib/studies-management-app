import type { Department, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
export type { StudiesCurriculum as StudiesCurriculumModelT } from "@prisma/client";

export function getStudiesCurriculums() {
  return prisma.studiesCurriculum.findMany({});
}

export function getStudiesCurriculum(depId: Department["code_id"]) {
  return prisma.studiesCurriculum.findUnique({ where: { dep_id: depId } });
}

export function updateUndergradStudiesCurriculum(
  depId: Department["code_id"],
  data: Prisma.JsonArray,
) {
  return prisma.studiesCurriculum.update({
    where: {
      dep_id: depId,
    },
    data: {
      undergrad: data,
    },
  });
}

export function updatePostgradStudiesCurriculum(
  depId: Department["code_id"],
  data: Prisma.JsonArray,
) {
  return prisma.studiesCurriculum.update({
    where: {
      dep_id: depId,
    },
    data: {
      postgrad: data,
    },
  });
}

export function updateRegistrationPeriod(depId: Department["code_id"], data: Prisma.JsonObject) {
  return prisma.studiesCurriculum.update({
    where: {
      dep_id: depId,
    },
    data: {
      registration_periods: data,
    },
  });
}
