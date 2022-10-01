import type { Department, Password, Role, User } from "@prisma/client";

export const users: {
  id: User["id"];
  depId: Department["code_id"];
  username: User["username"];
  password: Password["hash"];
  role: Role;
}[] = [
  {
    id: 1,
    depId: "IT",
    username: "superadmin",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "SUPERADMIN",
  },
  {
    id: 2,
    depId: "IT",
    username: "itr1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "REGISTRAR",
  },
  {
    id: 3,
    depId: "GEO",
    username: "geor1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "REGISTRAR",
  },
  {
    id: 4,
    depId: "GEO",
    username: "geop1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 5,
    depId: "IT",
    username: "itp1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 6,
    depId: "IT",
    username: "itp2",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 7,
    depId: "IT",
    username: "itp3",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 8,
    depId: "IT",
    username: "it17001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 9,
    depId: "IT",
    username: "it17002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 10,
    depId: "GEO",
    username: "geo18001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 11,
    depId: "GEO",
    username: "geo20001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 12,
    depId: "IT",
    username: "it20001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 13,
    depId: "IT",
    username: "it21001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 14,
    depId: "IT",
    username: "itp4",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
];
