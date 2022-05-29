import type { User, Role } from "@prisma/client";

export const users: {
  id: User["id"];
  username: User["username"];
  role: Role;
}[] = [
  { id: 1, username: "jason", role: "SUPERADMIN" },
  { id: 2, username: "celine", role: "REGISTRAR" },
  { id: 3, username: "natalie", role: "REGISTRAR" },
  { id: 4, username: "melvin", role: "PROFESSOR" },
  { id: 5, username: "gregory", role: "PROFESSOR" },
  { id: 6, username: "wendy", role: "PROFESSOR" },
  { id: 7, username: "thomas", role: "PROFESSOR" },
  { id: 8, username: "john", role: "STUDENT" },
  { id: 9, username: "mark", role: "STUDENT" },
  { id: 10, username: "helen", role: "STUDENT" },
  { id: 11, username: "steve", role: "STUDENT" },
  { id: 12, username: "anna", role: "STUDENT" },
  { id: 13, username: "denice", role: "STUDENT" },
];
