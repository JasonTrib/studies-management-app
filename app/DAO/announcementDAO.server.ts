import { prisma } from "~/db.server";
import type { Announcement, Course } from "@prisma/client";
export type { Course } from "@prisma/client";

export function getAllAnnoucements() {
  return prisma.announcement.findMany({});
}

export function getAnnoucements(depId: Course["dep_id"]) {
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

export function getCourseAnnoucements(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
    select: {
      announcements: true,
    },
  });
}

export function getCourseAnnoucement(id: Announcement["id"]) {
  return prisma.announcement.findUnique({
    where: { id },
  });
}
