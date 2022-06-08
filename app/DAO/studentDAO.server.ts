import { prisma } from "~/db.server";
import type { Course, Department, Student, User } from "@prisma/client";
import { users } from "prisma/seedData/users";
export type { Student } from "@prisma/client";

export function getAllStudents() {
  return prisma.student.findMany({});
}

export function getStudents(depId: Department["title_id"]) {
  return prisma.student.findMany({
    where: {
      user: {
        dep_id: depId,
      },
    },
  });
}

export function getStudent(id: Student["id"]) {
  return prisma.student.findUnique({
    where: { id },
  });
}

export function getStudentsProfiles(depId: Department["title_id"]) {
  return prisma.student.findMany({
    where: {
      user: {
        dep_id: depId,
      },
    },
    include: {
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
}

export function getStudentProfile(userId: User["id"]) {
  return prisma.student.findUnique({
    where: {
      id: userId,
    },
    include: {
      user: {
        select: {
          profile: true,
        },
      },
    },
  });
}

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

export function getStudentFollowedCourses(userId: Student["id"]) {
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

export function getStudentAnnouncements(userId: Student["id"]) {
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
