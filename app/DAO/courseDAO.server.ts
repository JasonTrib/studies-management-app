import { prisma } from "~/db.server";
import type { Course } from "@prisma/client";
export type { Course } from "@prisma/client";

export function getAllCourses() {
  return prisma.course.findMany({});
}

export function getCourses(department: Course["department"]) {
  return prisma.course.findMany({
    where: { department },
  });
}

export function getCourse(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
  });
}
