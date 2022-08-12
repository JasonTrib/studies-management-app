import type { Course, Student } from "@prisma/client";
import { prisma } from "~/db.server";

export function getStudentCourses(studentId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: studentId,
    },
    include: {
      course: true,
    },
  });
}

export function getStudentCoursesEnrolled(studentId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: studentId,
      is_enrolled: true,
    },
    include: {
      course: true,
    },
  });
}

export function getStudentCoursesFollowing(studentId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: studentId,
      is_following: true,
    },
    include: {
      course: true,
    },
  });
}

export function getStudentCoursesAnnouncements(studentId: Student["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: studentId,
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

export function getStudentCourseAnnouncements(studentId: Student["id"], courseId: Course["id"]) {
  return prisma.studentCourse.findFirst({
    where: {
      student_id: studentId,
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

export function getStudentCourseAnnouncementsCount(
  studentId: Student["id"],
  courseId: Course["id"],
) {
  return prisma.studentCourse.count({
    where: {
      student_id: studentId,
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

export function getStudentCoursesFollowingCount(courseId: Course["id"]) {
  return prisma.studentCourse.count({
    where: {
      course_id: courseId,
      is_following: true,
    },
  });
}

// includes the "has_seen" field, useful for differenciating seen/unseen announcements
function getStudentCourseAnnouncementsGenerous(studentId: Student["id"], courseId: Course["id"]) {
  return prisma.studentCourse.findMany({
    where: {
      student_id: studentId,
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
