import { prisma } from "~/db.server";
import type { Department } from "@prisma/client";
export type { Department as DepartmentModelT } from "@prisma/client";

export function getDepartments() {
  return prisma.department.findMany({});
}

export function getDepartment(depId: Department["code_id"]) {
  return prisma.department.findUnique({
    where: {
      code_id: depId,
    },
  });
}

export type departmentDataT = {
  code_id: string;
  title: string;
  description?: string;
  address?: string;
  email?: string;
  telephone?: string;
  foundation_date?: string;
  updated_at?: string;
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
      updated_at: data.updated_at,
    },
  });
}
