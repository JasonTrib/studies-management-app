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
  return prisma.studentCourse.findFirst({
    where: {
      student_id: userId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
          title: true,
        },
      },
    },
  });
}

export function getStudentCourseAnnouncementsCount(userId: Student["id"], courseId: Course["id"]) {
  return prisma.studentCourse.count({
    where: {
      student_id: userId,
      course_id: courseId,
      is_following: true,
    },
  });
}

export function getStudentCoursesRegisteredCount(courseId: Course["id"]) {
  return prisma.studentCourse.count({
    where: {
      course_id: courseId,
      is_enrolled: true,
    },
  });
}

export function getStudentCoursesFollowedCount(courseId: Course["id"]) {
  return prisma.studentCourse.count({
    where: {
      course_id: courseId,
      is_following: true,
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
