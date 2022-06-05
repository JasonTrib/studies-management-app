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
