import type { Student, User } from "@prisma/client";

export const students: {
  id: Student["id"];
  enrollment_year: Student["enrollment_year"];
  studies_status: Student["studies_status"];
  userId: User["id"];
}[] = [
  {
    id: 1,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2017,
    userId: 8,
  },
  {
    id: 2,
    studies_status: "POSTGRADUATE",
    enrollment_year: 2017,
    userId: 9,
  },
  {
    id: 3,
    studies_status: "POSTGRADUATE",
    enrollment_year: 2018,
    userId: 10,
  },
  {
    id: 4,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 11,
  },
  {
    id: 5,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 12,
  },
  {
    id: 6,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2021,
    userId: 13,
  },
];
