import { prisma } from "~/db.server";
import type { Course, CourseAnnouncement } from "@prisma/client";
export type { Course } from "@prisma/client";

export function getAllAnnoucements() {
  return prisma.courseAnnouncement.findMany({});
}

export function getAnnoucements(department: Course["department"]) {
  return prisma.course.findMany({
    where: { department },
    select: {
      id: true,
      title: true,
      courseAnnouncements: true,
    },
  });
}

export function getCourseAnnoucements(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
    select: {
      courseAnnouncements: true,
    },
  });
}

export function getCourseAnnoucement(id: CourseAnnouncement["id"]) {
  return prisma.courseAnnouncement.findUnique({
    where: { id },
  });
}
