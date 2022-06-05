import { prisma } from "~/db.server";
import type { Student, User } from "@prisma/client";
export type { Student } from "@prisma/client";

export function getAllStudents() {
  return prisma.student.findMany({});
}

export function getStudents(department: Student["department"]) {
  return prisma.student.findMany({
    where: { department },
  });
}

export function getStudent(id: Student["id"]) {
  return prisma.student.findUnique({
    where: { id },
  });
}

export function getStudentsProfiles(department: Student["department"]) {
  return prisma.student.findMany({
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
