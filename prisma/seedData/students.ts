import type { Student, User, Profile } from "@prisma/client";

export const students: {
  id: Student["id"];
  department: Student["department"];
  enrollment_year: Student["enrollment_year"];
  studies_status: Student["studies_status"];
  userId: User["id"];
  profileId: Profile["id"];
}[] = [
  {
    id: 1,
    studies_status: "UNDERGRADUATE",
    department: "IT",
    enrollment_year: 2017,
    userId: 8,
    profileId: 8,
  },
  {
    id: 2,
    studies_status: "POSTGRADUATE",
    department: "IT",
    enrollment_year: 2017,
    userId: 9,
    profileId: 9,
  },
  {
    id: 3,
    studies_status: "POSTGRADUATE",
    department: "GEO",
    enrollment_year: 2018,
    userId: 10,
    profileId: 10,
  },
  {
    id: 4,
    studies_status: "UNDERGRADUATE",
    department: "GEO",
    enrollment_year: 2020,
    userId: 11,
    profileId: 11,
  },
  {
    id: 5,
    studies_status: "UNDERGRADUATE",
    department: "IT",
    enrollment_year: 2020,
    userId: 12,
    profileId: 12,
  },
  {
    id: 6,
    studies_status: "UNDERGRADUATE",
    department: "IT",
    enrollment_year: 2021,
    userId: 13,
    profileId: 13,
  },
];
