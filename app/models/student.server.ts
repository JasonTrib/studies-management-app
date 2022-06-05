import type { Student, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Student } from "@prisma/client";

export function getStudentProfile(userId: User["id"]) {
  return prisma.student.findUnique({
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

export function getStudent(id: Student["id"]) {
  return prisma.student.findFirst({
    where: { id },
  });
}

export function getAllStudents() {
  return prisma.student.findMany({});
}

export function getDepartmentStudents(department: Student["department"]) {
  return prisma.student.findFirst({
    where: { department },
  });
}
