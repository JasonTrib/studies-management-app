import type { Student, User } from "@prisma/client";

type StudentsT = {
  id: Student["id"];
  enrollment_year: Student["enrollment_year"];
  studies_status: Student["studies_status"];
  userId: User["id"];
}[];

export const it_students: StudentsT = [
  {
    id: 1,
    studies_status: "ALUM",
    enrollment_year: 2015,
    userId: 100,
  },
  {
    id: 2,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2015,
    userId: 101,
  },
  {
    id: 3,
    studies_status: "ALUM",
    enrollment_year: 2015,
    userId: 102,
  },
  {
    id: 4,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2016,
    userId: 103,
  },
  {
    id: 5,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2016,
    userId: 104,
  },
  {
    id: 6,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2016,
    userId: 105,
  },
  {
    id: 7,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2016,
    userId: 106,
  },
  {
    id: 8,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2017,
    userId: 107,
  },
  {
    id: 9,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2017,
    userId: 108,
  },
  {
    id: 10,
    studies_status: "ALUM",
    enrollment_year: 2017,
    userId: 109,
  },
  {
    id: 11,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2017,
    userId: 110,
  },
  {
    id: 12,
    studies_status: "POSTGRADUATE",
    enrollment_year: 2017,
    userId: 111,
  },
  {
    id: 13,
    studies_status: "ALUM",
    enrollment_year: 2018,
    userId: 112,
  },
  {
    id: 14,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2018,
    userId: 113,
  },
  {
    id: 15,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2018,
    userId: 114,
  },
  {
    id: 16,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2018,
    userId: 115,
  },
  {
    id: 17,
    studies_status: "POSTGRADUATE",
    enrollment_year: 2018,
    userId: 116,
  },
  {
    id: 18,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2019,
    userId: 117,
  },
  {
    id: 19,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2019,
    userId: 118,
  },
  {
    id: 20,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2019,
    userId: 119,
  },
  {
    id: 21,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 120,
  },
  {
    id: 22,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 121,
  },
  {
    id: 23,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 122,
  },
  {
    id: 24,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2020,
    userId: 123,
  },
  {
    id: 25,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2021,
    userId: 124,
  },
  {
    id: 26,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2021,
    userId: 125,
  },
  {
    id: 27,
    studies_status: "UNDERGRADUATE",
    enrollment_year: 2021,
    userId: 126,
  },
  {
    id: 28,
    studies_status: "POSTGRADUATE",
    enrollment_year: 2022,
    userId: 127,
  },
];

const guest: StudentsT[0] = {
  id: 29,
  studies_status: "UNDERGRADUATE",
  enrollment_year: 2020,
  userId: 500,
};

export const students: StudentsT = [...it_students, guest];
