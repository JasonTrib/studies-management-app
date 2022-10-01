import type { Department, Professor, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Professor as ProfessorModelT } from "@prisma/client";

export function getAllProfessors() {
  return prisma.professor.findMany({});
}

export function getProfessor(id: Professor["id"]) {
  return prisma.professor.findUnique({
    where: { id },
  });
}

export function getProfessors(depId: Department["code_id"]) {
  return prisma.professor.findMany({
    where: {
      user: {
        dep_id: depId,
      },
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export function getProfessorsProfile(depId: Department["code_id"]) {
  return prisma.professor.findMany({
    where: {
      user: {
        dep_id: depId,
      },
    },
    include: {
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
}

export function getProfessorProfile(id: Professor["id"]) {
  return prisma.professor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          profile: true,
          dep_id: true,
        },
      },
    },
  });
}

export function getProfessorId(userId: User["id"]) {
  return prisma.professor.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
    },
  });
}
