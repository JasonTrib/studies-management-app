import type { User, Role, Department } from "@prisma/client";

export const users: {
  id: User["id"];
  depId: Department["title_id"];
  username: User["username"];
  role: Role;
}[] = [
  { id: 1, depId: "IT", username: "jason", role: "SUPERADMIN" },
  { id: 2, depId: "IT", username: "celine", role: "REGISTRAR" },
  { id: 3, depId: "GEO", username: "natalie", role: "REGISTRAR" },
  { id: 4, depId: "GEO", username: "melvin", role: "PROFESSOR" },
  { id: 5, depId: "IT", username: "gregory", role: "PROFESSOR" },
  { id: 6, depId: "IT", username: "wendy", role: "PROFESSOR" },
  { id: 7, depId: "IT", username: "thomas", role: "PROFESSOR" },
  { id: 8, depId: "IT", username: "john", role: "STUDENT" },
  { id: 9, depId: "IT", username: "mark", role: "STUDENT" },
  { id: 10, depId: "GEO", username: "helen", role: "STUDENT" },
  { id: 11, depId: "GEO", username: "steve", role: "STUDENT" },
  { id: 12, depId: "IT", username: "anna", role: "STUDENT" },
  { id: 13, depId: "IT", username: "denice", role: "STUDENT" },
];
