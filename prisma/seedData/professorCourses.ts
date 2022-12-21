import type { ProfessorCourse } from "@prisma/client";

const generateRelations = (profId: number, courseIds: number[], lecturing = true) =>
  courseIds.map((courseId) => ({
    profId: profId,
    courseId: courseId,
    isLecturing: lecturing,
    isFollowing: true,
  }));

export const professorCourses: {
  profId: ProfessorCourse["prof_id"];
  courseId: ProfessorCourse["course_id"];
  isLecturing: ProfessorCourse["is_lecturing"];
  isFollowing: ProfessorCourse["is_following"];
}[] = [
  ...generateRelations(1, [3, 8]),
  ...generateRelations(1, [10, 33], false),
  ...generateRelations(2, [1, 2, 4, 9, 35]),
  ...generateRelations(2, [27, 17], false),
  ...generateRelations(3, [3, 11, 32, 30, 29, 25]),
  ...generateRelations(4, [15, 12, 14, 13]),
  ...generateRelations(4, [23, 1, 2], false),
  ...generateRelations(5, [28, 31, 5, 27]),
  ...generateRelations(5, [3, 23], false),
  ...generateRelations(6, [8, 11, 25]),
  ...generateRelations(7, [11, 28, 5], false),
  ...generateRelations(8, [33, 16, 18, 22]),
  ...generateRelations(8, [1, 2, 4, 5, 9, 19], false),
  ...generateRelations(9, [21, 6, 7, 17, 24, 37]),
  ...generateRelations(9, [8, 12], false),
  ...generateRelations(10, [13, 10, 23]),
  ...generateRelations(11, [10, 19, 20, 36]),
  ...generateRelations(11, [13, 24, 33], false),
  ...generateRelations(12, [2, 26, 9]),
  ...generateRelations(12, [15, 17, 28, 29, 31], false),
];
