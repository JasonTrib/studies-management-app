import type { Course, Professor } from "@prisma/client";
import { prisma } from "~/db.server";
export type { ProfessorCourse as ProfessorCourseModelT } from "@prisma/client";

export function getAllProfessorCourses() {
  return prisma.professorCourse.findMany({
    where: {},
    include: {
      course: true,
      professor: {
        include: {
          user: {
            select: {
              profile: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getProfessorCourses(userId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: userId,
      is_lecturing: true,
    },
    include: {
      course: true,
    },
  });
}

export function getProfessorCoursesFollowed(userId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: userId,
      is_following: true,
    },
    include: {
      course: true,
    },
  });
}

export function getProfessorCoursesAnnouncements(userId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: userId,
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

export function getProfessorCourseAnnouncements(userId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: userId,
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
function getProfessorCourseAnnouncementsGenerous(userId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: userId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
      professor: {
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
