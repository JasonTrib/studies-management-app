import type { Department, Password, Role, User } from "@prisma/client";

type UserT = {
  id: User["id"];
  depId: Department["code_id"];
  username: User["username"];
  password: Password["hash"];
  role: Role;
}[];

export const it_registrar_users: UserT = [
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
    depId: "IT",
    username: "itr2",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "REGISTRAR",
  },
];

export const it_professor_users: UserT = [
  {
    id: 10,
    depId: "IT",
    username: "itp1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 11,
    depId: "IT",
    username: "itp2",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 12,
    depId: "IT",
    username: "itp3",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 13,
    depId: "IT",
    username: "itp4",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 14,
    depId: "IT",
    username: "itp5",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 15,
    depId: "IT",
    username: "itp6",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 16,
    depId: "IT",
    username: "itp7",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 17,
    depId: "IT",
    username: "itp8",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 18,
    depId: "IT",
    username: "itp9",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 19,
    depId: "IT",
    username: "itp10",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 20,
    depId: "IT",
    username: "itp11",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 21,
    depId: "IT",
    username: "itp12",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
];

export const it_student_users: UserT = [
  {
    id: 100,
    depId: "IT",
    username: "it15001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 101,
    depId: "IT",
    username: "it15002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 102,
    depId: "IT",
    username: "it15003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 103,
    depId: "IT",
    username: "it16001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 104,
    depId: "IT",
    username: "it16002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 105,
    depId: "IT",
    username: "it16003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 106,
    depId: "IT",
    username: "it16004",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 107,
    depId: "IT",
    username: "it17001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 108,
    depId: "IT",
    username: "it17002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 109,
    depId: "IT",
    username: "it17003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 110,
    depId: "IT",
    username: "it17004",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 111,
    depId: "IT",
    username: "it17005",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 112,
    depId: "IT",
    username: "it18001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 113,
    depId: "IT",
    username: "it18002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 114,
    depId: "IT",
    username: "it18003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 115,
    depId: "IT",
    username: "it18004",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 116,
    depId: "IT",
    username: "it18005",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 117,
    depId: "IT",
    username: "it19001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 118,
    depId: "IT",
    username: "it19002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 119,
    depId: "IT",
    username: "it19003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 120,
    depId: "IT",
    username: "it20001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 121,
    depId: "IT",
    username: "it20002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 122,
    depId: "IT",
    username: "it20003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 123,
    depId: "IT",
    username: "it20004",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 124,
    depId: "IT",
    username: "it21001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 125,
    depId: "IT",
    username: "it21002",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 126,
    depId: "IT",
    username: "it21003",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 127,
    depId: "IT",
    username: "it22001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
];

export const geo_users: UserT = [
  {
    id: 200,
    depId: "GEO",
    username: "geor1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "REGISTRAR",
  },
  {
    id: 0,
    depId: "GEO",
    username: "geop1",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "PROFESSOR",
  },
  {
    id: 0,
    depId: "GEO",
    username: "geo18001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
  {
    id: 0,
    depId: "GEO",
    username: "geo20001",
    password: process.env.SEED_USER_PASSWORD || "password",
    role: "STUDENT",
  },
];

export const users: UserT = [
  ...it_registrar_users,
  ...it_professor_users,
  ...it_student_users,
  // ...geo_users
];
