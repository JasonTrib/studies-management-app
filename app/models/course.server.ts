import type { Course } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Course } from "@prisma/client";

export function getCourse(id: Course["id"]) {
  return prisma.course.findFirst({
    where: { id },
  });
}

export function getAllCourses() {
  return prisma.course.findMany({});
}

export function getDepartmentCourses(department: Course["department"]) {
  return prisma.course.findFirst({
    where: { department },
  });
}
