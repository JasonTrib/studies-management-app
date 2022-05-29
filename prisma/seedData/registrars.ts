import type { Registrar, User } from "@prisma/client";

export const registrars: {
  id: Registrar["id"];
  title: Registrar["title"];
  department: Registrar["department"];
  userId: User["id"];
}[] = [
  { id: 1, title: "IT Secretary", department: "IT", userId: 2 },
  { id: 2, title: "GEO Secretary", department: "GEO", userId: 3 },
];
