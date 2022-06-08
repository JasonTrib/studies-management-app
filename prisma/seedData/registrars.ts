import type { Registrar, User } from "@prisma/client";

export const registrars: {
  id: Registrar["id"];
  title: Registrar["title"];
  userId: User["id"];
}[] = [
  { id: 1, title: "IT Secretary", userId: 2 },
  { id: 2, title: "GEO Secretary", userId: 3 },
];
