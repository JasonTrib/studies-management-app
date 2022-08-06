import type { Department, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { User as UserModelT } from "@prisma/client";

export function getAllUsers() {
  return prisma.user.findMany({});
}

export function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      password: true,
    },
  });
}

export function getUser(userId: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      dep_id: true,
      role: true,
    },
  });
}

export function getUserAnnouncements(userId: User["id"]) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userAnnouncements: {
        include: {
          announcement: true,
        },
      },
    },
  });
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

export type studentUserDataT = {
  dep_id: string;
  username: string;
  password: string;
  role: "STUDENT";
  enrollment_year: number;
  studies_status: "UNDERGRADUATE" | "POSTGRADUATE" | "ALUM";
};

export function createStudent(data: studentUserDataT) {
  return prisma.user.create({
    data: {
      dep_id: data.dep_id,
      username: data.username,
      role: data.role,
      password: {
        create: {
          hash: data.password,
        },
      },
      profile: {
        create: {},
      },
      student: {
        create: {
          enrollment_year: data.enrollment_year,
          studies_status: data.studies_status,
        },
      },
    },
  });
}

export type professorUserDataT = {
  dep_id: string;
  username: string;
  password: string;
  role: "PROFESSOR";
  title:
    | "Lecturer"
    | "Assistant Professor"
    | "Associate Professor"
    | "Professor"
    | "Emeritus Professor";
};

export function createProfessor(data: professorUserDataT) {
  return prisma.user.create({
    data: {
      dep_id: data.dep_id,
      username: data.username,
      role: data.role,
      password: {
        create: {
          hash: data.password,
        },
      },
      profile: {
        create: {},
      },
      professor: {
        create: {
          title: data.title,
        },
      },
    },
  });
}
