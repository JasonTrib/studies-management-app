import { prisma } from "~/db.server";
import type { User } from "@prisma/client";
export type { Student } from "@prisma/client";

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

export function getUserAnnouncementsPosted(userId: User["id"]) {
  return prisma.userAnnouncement.findMany({
    where: {
      user_id: userId,
      has_posted: true,
    },
    include: {
      announcement: true,
    },
  });
}
