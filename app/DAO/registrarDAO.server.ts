import { prisma } from "~/db.server";
import type { Registrar, User } from "@prisma/client";
export type { Registrar } from "@prisma/client";

export function getAllRegistrars() {
  return prisma.registrar.findMany({});
}

export function getRegistrars(department: Registrar["department"]) {
  return prisma.registrar.findMany({
    where: { department },
  });
}

export function getRegistrar(id: Registrar["id"]) {
  return prisma.registrar.findUnique({
    where: { id },
  });
}

export function getRegistrarsProfiles(department: Registrar["department"]) {
  return prisma.registrar.findMany({
    where: {
      department: department,
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
        },
      },
    },
  });
}
