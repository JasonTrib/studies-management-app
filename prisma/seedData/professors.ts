import type { Professor, User } from "@prisma/client";

type ProfessorsT = {
  id: Professor["id"];
  title: Professor["title"];
  userId: User["id"];
}[];

export const it_professors: ProfessorsT = [
  { id: 1, title: "Emeritus Professor", userId: 10 },
  { id: 2, title: "Professor", userId: 11 },
  { id: 3, title: "Professor", userId: 12 },
  { id: 4, title: "Professor", userId: 13 },
  { id: 5, title: "Professor", userId: 14 },
  { id: 6, title: "Associate Professor", userId: 15 },
  { id: 7, title: "Lecturer", userId: 16 },
  { id: 8, title: "Professor", userId: 17 },
  { id: 9, title: "Professor", userId: 18 },
  { id: 10, title: "Assistant Professor", userId: 19 },
  { id: 11, title: "Professor", userId: 20 },
  { id: 12, title: "Assistant Professor", userId: 21 },
];

export const professors: ProfessorsT = [...it_professors];
