import type { Professor, User } from "@prisma/client";

export const professors: {
  id: Professor["id"];
  title: Professor["title"];
  department: Professor["department"];
  userId: User["id"];
}[] = [
  { id: 1, title: "Professor", department: "GEO", userId: 4 },
  { id: 2, title: "Professor", department: "IT", userId: 5 },
  { id: 3, title: "Professor", department: "IT", userId: 6 },
  { id: 4, title: "Assistant Professor", department: "IT", userId: 7 },
];
