import type { Professor, User } from "@prisma/client";

export const professors: {
  id: Professor["id"];
  title: Professor["title"];
  userId: User["id"];
}[] = [
  { id: 1, title: "Professor", userId: 4 },
  { id: 2, title: "Professor", userId: 5 },
  { id: 3, title: "Professor", userId: 6 },
  { id: 4, title: "Assistant Professor", userId: 7 },
  { id: 5, title: "Professor", userId: 14 },
];
