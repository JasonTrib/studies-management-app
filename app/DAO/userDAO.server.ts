import { prisma } from "~/db.server";
import type { Department, User } from "@prisma/client";
export type { User as UserModelT } from "@prisma/client";
export type { Profile as ProfileModelT } from "@prisma/client";

export function getAllUsers() {
  return prisma.user.findMany({});
}

export function getUserPassword(userId: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      password: true,
    },
  });
}

export function getUserAnnouncements(userId: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userAnnouncements: {
        include: {
          announcement: true,
        },
      },
    },
  });
}

export function getProfessors(depId: Department["title_id"]) {
  return prisma.user.findMany({
    where: {
      dep_id: depId,
    },
    select: {
      professor: true,
    },
  });
}
