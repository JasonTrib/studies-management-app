import { prisma } from "~/db.server";
import type { Department, Prisma } from "@prisma/client";
export type { Department as DepartmentModelT } from "@prisma/client";

export function getDepartments() {
  return prisma.department.findMany({});
}

export function getDepartmentsCount() {
  return prisma.department.count();
}

export function getDepartment(depId: Department["code_id"]) {
  return prisma.department.findUnique({
    where: {
      code_id: depId,
    },
  });
}

export function getDepartmentOnCode(code: string) {
  return prisma.department.findUnique({
    where: {
      code_id: code,
    },
  });
}

export function getDepartmentOnTitle(title: string) {
  return prisma.department.findUnique({
    where: {
      title: title,
    },
  });
}

export type departmentDataT = {
  code_id: string;
  title: string;
  description: string | null;
  address: string | null;
  email: string | null;
  telephone: string | null;
  foundation_date: string | null;
};

export function editDepartment(data: departmentDataT) {
  return prisma.department.update({
    where: {
      code_id: data.code_id,
    },
    data: {
      title: data.title,
      description: data.description,
      address: data.address,
      email: data.email,
      telephone: data.telephone,
      foundation_date: data.foundation_date,
      updated_at: new Date().toISOString(),
    },
  });
}

export type studiesCurriculumDataT = {
  undergrad: Prisma.JsonArray;
  postgrad: Prisma.JsonArray;
  registration_periods: Prisma.JsonObject;
};

export function createDepartment(data: departmentDataT & studiesCurriculumDataT) {
  return prisma.department.create({
    data: {
      code_id: data.code_id,
      title: data.title,
      description: data.description,
      address: data.address,
      email: data.email,
      telephone: data.telephone,
      foundation_date: data.foundation_date,
      StudiesCurriculum: {
        create: {
          undergrad: data.undergrad,
          postgrad: data.postgrad,
          registration_periods: data.registration_periods,
        },
      },
    },
  });
}

export type departmentWithUserDataT = {
  code_id: string;
  title: string;
  description?: string;
  address?: string;
  email?: string;
  telephone?: string;
  foundation_date?: string;
  username: string;
  password: string;
  role: "SUPERADMIN";
} & studiesCurriculumDataT;

export function createDepartmentWithSuperadmin(data: departmentWithUserDataT) {
  return prisma.department.create({
    data: {
      code_id: data.code_id,
      title: data.title,
      description: data.description,
      address: data.address,
      email: data.email,
      telephone: data.telephone,
      foundation_date: data.foundation_date,
      Users: {
        create: {
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
        },
      },
      StudiesCurriculum: {
        create: {
          undergrad: data.undergrad,
          postgrad: data.postgrad,
          registration_periods: data.registration_periods,
        },
      },
    },
  });
}

export function deleteDepartment(depId: Department["code_id"]) {
  return prisma.department.delete({
    where: {
      code_id: depId,
    },
  });
}
