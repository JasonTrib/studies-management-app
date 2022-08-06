import type { Department, Password, Role, User } from "@prisma/client";

export const users: {
  id: User["id"];
  depId: Department["title_id"];
  username: User["username"];
  password: Password["hash"];
  role: Role;
}[] = [
  {
    id: 1,
    depId: "IT",
    username: "jason",
    password: "pass1234",
    role: "SUPERADMIN",
  },
  {
    id: 2,
    depId: "IT",
    username: "celine",
    password: "pass1234",
    role: "REGISTRAR",
  },
  {
    id: 3,
    depId: "GEO",
    username: "natalie",
    password: "pass1234",
    role: "REGISTRAR",
  },
  {
    id: 4,
    depId: "GEO",
    username: "melvin",
    password: "pass1234",
    role: "PROFESSOR",
  },
  {
    id: 5,
    depId: "IT",
    username: "gregory",
    password: "pass1234",
    role: "PROFESSOR",
  },
  {
    id: 6,
    depId: "IT",
    username: "wendy",
    password: "pass1234",
    role: "PROFESSOR",
  },
  {
    id: 7,
    depId: "IT",
    username: "thomas",
    password: "pass1234",
    role: "PROFESSOR",
  },
  {
    id: 8,
    depId: "IT",
    username: "john",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 9,
    depId: "IT",
    username: "mark",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 10,
    depId: "GEO",
    username: "helen",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 11,
    depId: "GEO",
    username: "steve",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 12,
    depId: "IT",
    username: "anna",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 13,
    depId: "IT",
    username: "denice",
    password: "pass1234",
    role: "STUDENT",
  },
  {
    id: 14,
    depId: "IT",
    username: "clyde",
    password: "pass1234",
    role: "PROFESSOR",
  },
];
