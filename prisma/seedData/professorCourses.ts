import type { ProfessorCourse } from "@prisma/client";

export const professorCourses: {
  profId: ProfessorCourse["prof_id"];
  courseId: ProfessorCourse["course_id"];
  isLecturing: ProfessorCourse["is_lecturing"];
  isFollowing: ProfessorCourse["is_following"];
}[] = [
  {
    profId: 1,
    courseId: 1,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 2,
    courseId: 6,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 2,
    courseId: 7,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 2,
    courseId: 11,
    isLecturing: false,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 2,
    isLecturing: true,
    isFollowing: false,
  },
  {
    profId: 3,
    courseId: 3,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 4,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 5,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 4,
    courseId: 3,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 4,
    courseId: 8,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 5,
    courseId: 2,
    isLecturing: false,
    isFollowing: true,
  },
  {
    profId: 5,
    courseId: 9,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 5,
    courseId: 10,
    isLecturing: true,
    isFollowing: true,
  },
  {
    profId: 5,
    courseId: 11,
    isLecturing: true,
    isFollowing: true,
  },
];
