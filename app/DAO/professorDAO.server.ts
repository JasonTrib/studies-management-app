import { prisma } from "~/db.server";
import type { Course, Department, Professor, User } from "@prisma/client";
export type { Professor } from "@prisma/client";

export function getAllProfessors() {
  return prisma.professor.findMany({});
}

export function getProfessors(depId: Department["title_id"]) {
  return prisma.user.findMany({
    where: {
      dep_id: depId,
    },
    select: {
      professor: true,
    },
  });
}

export function getProfessor(id: Professor["id"]) {
  return prisma.professor.findUnique({
    where: { id },
  });
}

export function getProfessorsProfiles(depId: Department["title_id"]) {
  return prisma.professor.findMany({
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

export function getProfessorProfile(userId: User["id"]) {
  return prisma.professor.findUnique({
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

export function getProfessorFollowedCourses(userId: Professor["id"]) {
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

export function getProfessorAnnouncements(userId: Professor["id"]) {
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
