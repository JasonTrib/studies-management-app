import { prisma } from "~/db.server";
import type { Announcement, Course, StudentCourse, User } from "@prisma/client";
import { getStudentFollowedCourses } from "./studentDAO.server";
export type { Announcement as AnnouncementModelT } from "@prisma/client";

export function getAllAnnoucements() {
  return prisma.announcement.findMany({
    include: {
      course: true,
    },
  });
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
    include: {
      course: true,
    },
  });
}

function getUserAnnoucement(userId: User["id"], annId: Announcement["id"]) {
  return prisma.userAnnouncement.findUnique({
    where: {
      user_id_announcement_id: {
        user_id: userId,
        announcement_id: annId,
      },
    },
    include: {
      announcement: {
        include: {
          course: true,
        },
      },
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
}

export async function getAnnouncementsFollowed(userId: User["id"]) {
  const coursesFollowed = await getStudentFollowedCourses(userId);
  const announcements = await getAllAnnoucements();

  return { coursesFollowed, announcements };
}
