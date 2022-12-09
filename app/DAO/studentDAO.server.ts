import type { Department, Student, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { Student as StudentModelT, StudentCourse as StudentCourseT } from "@prisma/client";

export function getAllStudents() {
  return prisma.student.findMany({});
}

export function getStudents(depId: Department["code_id"]) {
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

export function getStudentsProfile(depId: Department["code_id"]) {
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

export function getStudentProfile(id: Student["id"]) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          profile: true,
          dep_id: true,
        },
      },
    },
  });
}

export function getStudentId(userId: User["id"]) {
  return prisma.student.findUnique({
    where: {
      user_id: userId,
    },
    select: {
      id: true,
    },
  });
}

export function getStudentFromUserId(userId: User["id"]) {
  return prisma.student.findUnique({
    where: {
      user_id: userId,
    },
  });
}

export function updateStudentRegistration(id: Student["id"], registrationDate: string) {
  return prisma.student.update({
    where: { id },
    data: {
      latest_registration: registrationDate,
    },
  });
}

export type updateStudentDataT = {
  enrollmentYear: Student["enrollment_year"];
  studiesStatus: Student["studies_status"];
};

export function updateStudent(userId: User["id"], data: updateStudentDataT) {
  return prisma.student.update({
    where: { user_id: userId },
    data: {
      enrollment_year: data.enrollmentYear,
      studies_status: data.studiesStatus,
    },
  });
}
