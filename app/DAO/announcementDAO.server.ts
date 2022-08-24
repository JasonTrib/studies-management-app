import type { Announcement, Course, Department } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Announcement as AnnouncementModelT } from "@prisma/client";

export function getAllAnnoucements() {
  return prisma.announcement.findMany({
    include: {
      course: true,
    },
  });
}

export function getAnnoucements(depId: Department["title_id"]) {
  return prisma.announcement.findMany({
    where: {
      course: {
        dep_id: depId,
      },
    },
    include: {
      course: true,
    },
  });
}

export function getAnnoucement(id: Announcement["id"]) {
  return prisma.announcement.findUnique({
    where: { id },
    include: {
      course: true,
    },
  });
}

export function getAnnoucementsOfCourse(courseId: Course["id"]) {
  return prisma.announcement.findMany({
    where: {
      course_id: courseId,
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
  });
}

export type announcementDataT = {
  course_id: number;
  title: string;
  body: string;
};

export function createAnnouncement(data: announcementDataT) {
  return prisma.announcement.create({
    data: {
      title: data.title,
      body: data.body,
      course: {
        connect: {
          id: data.course_id,
        },
      },
    },
  });
}

export function deleteAnnouncement(id: Announcement["id"]) {
  return prisma.announcement.delete({
    where: { id },
  });
}
