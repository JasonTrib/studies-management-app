import type { ProfessorCourse } from "@prisma/client";

export const professorCourses: {
  profId: ProfessorCourse["prof_id"];
  courseId: ProfessorCourse["course_id"];
  isEnrolled: ProfessorCourse["is_lecturing"];
  isFollowing: ProfessorCourse["is_following"];
}[] = [
  {
    profId: 1,
    courseId: 1,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 2,
    courseId: 6,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 2,
    courseId: 7,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 2,
    isEnrolled: true,
    isFollowing: false,
  },
  {
    profId: 3,
    courseId: 3,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 4,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 3,
    courseId: 5,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 4,
    courseId: 3,
    isEnrolled: true,
    isFollowing: true,
  },
  {
    profId: 4,
    courseId: 8,
    isEnrolled: true,
    isFollowing: true,
  },
];
