import { prisma } from "~/db.server";
import type { Professor, User } from "@prisma/client";
export type { Professor } from "@prisma/client";

export function getAllProfessors() {
  return prisma.professor.findMany({});
}

export function getProfessors(department: Professor["department"]) {
  return prisma.professor.findMany({
    where: { department },
  });
}

export function getProfessor(id: Professor["id"]) {
  return prisma.professor.findUnique({
    where: { id },
  });
}

export function getProfessorsProfiles(department: Professor["department"]) {
  return prisma.professor.findMany({
    where: {
      department: department,
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

// export function getProfessorCourses(userId: Professor["id"]) {
//   return prisma.professorCourse.findMany({
//     where: {
//       professor_id: userId,
//     },
//     include: {
//       course: true,
//     },
//   });
// }

// export function getProfessorFollowedCourses(userId: Professor["id"]) {
//   return prisma.professorCourse.findMany({
//     where: {
//       professor_id: userId,
//       is_following: true,
//     },
//     include: {
//       course: true,
//     },
//   });
// }
