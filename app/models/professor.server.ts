import { prisma } from "~/db.server";
import type { User } from "@prisma/client";
export type { Professor } from "@prisma/client";

export function getAllProfessors() {
  return prisma.professor.findMany({});
}

export function getProfessorProfile(userId: User["id"]) {
  return prisma.professor.findUnique({
    where: {
      id: userId,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });
}
