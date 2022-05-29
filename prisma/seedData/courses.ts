import type { Course, Professor } from "@prisma/client";

export const courses: {
  id: Course["id"];
  title: Course["title"];
  semester: Course["semester"];
  department: Course["department"];
  isElective: Course["is_elective"];
  isPostgraduate: Course["is_postgraduate"];
  professorId: Professor["id"];
}[] = [
  {
    id: 1,
    title: "Meteorology - Climatology",
    semester: "1",
    department: "GEO",
    isElective: false,
    isPostgraduate: false,
    professorId: 1,
  },
  {
    id: 2,
    title: "Object Oriented Programming",
    semester: "3",
    department: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 2,
  },
  {
    id: 3,
    title: "Data Structures",
    semester: "3",
    department: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 2,
  },
  {
    id: 4,
    title: "Cloud Services",
    semester: "1",
    department: "IT",
    isElective: true,
    isPostgraduate: true,
    professorId: 2,
  },
  {
    id: 5,
    title: "Signals and Systems",
    semester: "5",
    department: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 6,
    title: "Discrete Mathematics",
    semester: "2",
    department: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 7,
    title: "Cryptography",
    semester: "4",
    department: "IT",
    isElective: true,
    isPostgraduate: false,
    professorId: 3,
  },
  {
    id: 8,
    title: "Data Bases",
    semester: "2",
    department: "IT",
    isElective: false,
    isPostgraduate: false,
    professorId: 4,
  },
];
