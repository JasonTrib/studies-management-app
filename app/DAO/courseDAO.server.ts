import { prisma } from "~/db.server";
import type { Course } from "@prisma/client";
export type { Course as CourseModelT } from "@prisma/client";

export function getAllCourses() {
  return prisma.course.findMany({});
}

export function getCourses(depId: Course["dep_id"]) {
  return prisma.course.findMany({
    where: {
      dep_id: depId,
    },
  });
}

export function getCourse(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
  });
}

export function getCourseAnnoucements(depId: Course["dep_id"]) {
  return prisma.course.findMany({
    where: {
      dep_id: depId,
    },
    select: {
      id: true,
      title: true,
      announcements: true,
    },
  });
}

export function getCourseAnnoucement(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
    select: {
      announcements: true,
    },
  });
}
