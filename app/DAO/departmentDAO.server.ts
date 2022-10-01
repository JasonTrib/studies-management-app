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
