import { prisma } from "~/db.server";
import type { Department, Registrar, User } from "@prisma/client";
export type { Registrar as RegistrarModelT } from "@prisma/client";

export function getAllRegistrars() {
  return prisma.registrar.findMany({});
}

export function getRegistrars(depId: Department["title_id"]) {
  return prisma.registrar.findMany({
    where: {
      user: {
        dep_id: depId,
      },
    },
  });
}

export function getRegistrar(id: Registrar["id"]) {
  return prisma.registrar.findUnique({
    where: { id },
  });
}

export function getRegistrarsProfile(depId: Department["title_id"]) {
  return prisma.registrar.findMany({
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

export function getRegistrarProfile(userId: User["id"]) {
  return prisma.registrar.findUnique({
    where: {
      id: userId,
    },
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
