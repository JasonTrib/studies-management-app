import type { Department, Registrar, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Registrar as RegistrarModelT } from "@prisma/client";

export function getAllRegistrars() {
  return prisma.registrar.findMany({});
}

export function getRegistrars(depId: Department["code_id"]) {
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

export function getRegistrarsProfile(depId: Department["code_id"]) {
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

export function getRegistrarFromUserId(userId: User["id"]) {
  return prisma.registrar.findUnique({
    where: {
      user_id: userId,
    },
  });
}

export function getRegistrarProfile(id: Registrar["id"]) {
  return prisma.registrar.findUnique({
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

export function updateRegistrar(userId: User["id"], title: Registrar["title"]) {
  return prisma.registrar.update({
    where: { user_id: userId },
    data: {
      title: title,
    },
  });
}
