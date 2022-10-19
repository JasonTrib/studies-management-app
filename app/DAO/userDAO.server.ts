import type { Department, Password, User } from "@prisma/client";
import { prisma } from "~/db.server";
export type { User as UserModelT } from "@prisma/client";

export function getAllUsers() {
  return prisma.user.findMany({});
}

export function getAllUsersExceptSuperadminsShort() {
  return prisma.user.findMany({
    where: {
      role: {
        not: "SUPERADMIN",
      },
    },
    select: {
      dep_id: true,
    },
  });
}

export function getUsersCount(depId: Department["code_id"]) {
  return prisma.user.count({
    where: {
      AND: [
        { dep_id: depId },
        {
          role: {
            not: "SUPERADMIN",
          },
        },
      ],
    },
  });
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

export function getUser(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      dep_id: true,
      role: true,
    },
  });
}

export function getUserOnUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export function getDepartmentRegistrars(dep: Department["code_id"]) {
  return prisma.user.findMany({
    where: {
      AND: [
        { dep_id: dep },
        {
          role: {
            equals: "REGISTRAR",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          is_public: true,
        },
      },
      registrar: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export function getDepartmentProfessors(dep: Department["code_id"]) {
  return prisma.user.findMany({
    where: {
      AND: [
        { dep_id: dep },
        {
          role: {
            equals: "PROFESSOR",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          is_public: true,
        },
      },
      professor: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export function getDepartmentStudents(dep: Department["code_id"]) {
  return prisma.user.findMany({
    where: {
      AND: [
        { dep_id: dep },
        {
          role: {
            equals: "STUDENT",
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          is_public: true,
        },
      },
      student: {
        select: {
          id: true,
          enrollment_year: true,
          studies_status: true,
        },
      },
    },
  });
}

export function getRegistrarUserProfile(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      role: true,
      department: {
        select: {
          title: true,
        },
      },
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          phone: true,
          info: true,
          is_public: true,
          created_at: true,
        },
      },
      registrar: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export function getProfessorUserProfile(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      role: true,
      department: {
        select: {
          title: true,
        },
      },
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          phone: true,
          info: true,
          is_public: true,
          created_at: true,
        },
      },
      professor: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export function getStudentUserProfile(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      username: true,
      role: true,
      department: {
        select: {
          title: true,
        },
      },
      profile: {
        select: {
          fullname: true,
          email: true,
          gender: true,
          phone: true,
          info: true,
          is_public: true,
          created_at: true,
        },
      },
      student: {
        select: {
          id: true,
          enrollment_year: true,
          studies_status: true,
        },
      },
    },
  });
}

export function getUserAnnouncements(id: User["id"]) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      userAnnouncements: {
        include: {
          announcement: true,
        },
      },
    },
  });
}

export function getProfessors(depId: Department["code_id"]) {
  return prisma.user.findMany({
    where: {
      dep_id: depId,
    },
    select: {
      professor: true,
    },
  });
}

export function getRegistrarsCount(depId: Department["code_id"]) {
  return prisma.registrar.count({
    where: {
      user: {
        dep_id: depId,
      },
    },
  });
}

export function getProfessorsCount(depId: Department["code_id"]) {
  return prisma.professor.count({
    where: {
      user: {
        dep_id: depId,
      },
    },
  });
}

export function getStudentsCount(depId: Department["code_id"]) {
  return prisma.student.count({
    where: {
      user: {
        dep_id: depId,
      },
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

export type registrarUserDataT = {
  dep_id: string;
  username: string;
  password: string;
  role: "REGISTRAR";
  title: string;
};

export function createRegistrar(data: registrarUserDataT) {
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
      registrar: {
        create: {
          title: data.title,
        },
      },
    },
  });
}

export function updateUserPassword(username: User["username"], password: Password["hash"]) {
  return prisma.user.update({
    where: {
      username: username,
    },
    data: {
      password: {
        update: {
          hash: password,
        },
      },
    },
  });
}

export function deleteUser(id: User["id"]) {
  return prisma.user.delete({
    where: { id },
  });
}
