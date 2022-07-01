import type { Course, Student } from "@prisma/client";
import { prisma } from "~/db.server";

export function getStudentCourses(userId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: userId,
      is_enrolled: true,
    },
    include: {
      course: true,
    },
  });
}

export function getStudentCoursesFollowed(userId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: userId,
      is_following: true,
    },
    include: {
      course: true,
    },
  });
}

export function getStudentCoursesAnnouncements(userId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: userId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
    },
  });
}

export function getStudentCourseAnnouncements(userId: Student["id"], courseId: Course["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: userId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
    },
  });
}

// includes the "has_seen" field, useful for differenciating seen/unseen announcements
function getStudentCourseAnnouncementsGenerous(userId: Student["id"], courseId: Course["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: userId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
      student: {
        select: {
          user: {
            select: {
              userAnnouncements: true,
            },
          },
        },
      },
    },
  });
}
