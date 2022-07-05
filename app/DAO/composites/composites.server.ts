import type { Department, Student, User } from "@prisma/client";
import { getAllAnnoucements } from "../announcementDAO.server";
import { getCourses } from "../courseDAO.server";
import { getAllProfessorCourses } from "../professorCourseDAO.server";
import { getStudentCourses, getStudentCoursesFollowed } from "../studentCourseDAO.server";

export async function getAnnouncementsFollowed(userId: User["id"]) {
  const coursesFollowed = await getStudentCoursesFollowed(userId);
  const announcements = await getAllAnnoucements();

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  return announcementsFollowed;
}

export async function getCoursesRegistered(userId: Student["id"]) {
  const studentCoursesRaw = await getStudentCourses(userId);
  const professorCoursesRaw = await getAllProfessorCourses();

  const studentCourses = studentCoursesRaw.map((x) => x.course);
  const profCourses = studentCourses.flatMap((studentCourse) =>
    professorCoursesRaw.filter((professorCourse) => professorCourse.course_id === studentCourse.id),
  );
  const coursesRegistered = studentCourses;

  coursesRegistered.forEach((course: any) => {
    course.professors = profCourses
      .map((profCourse) =>
        profCourse.course_id === course.id
          ? `${profCourse.professor.user.profile?.name} ${profCourse.professor.user.profile?.surname}`
          : null,
      )
      .filter((x) => x);
  });

  return coursesRegistered;
}

export async function getCoursesExtended(depId: Department["title_id"]) {
  const courses = await getCourses(depId);
  const profCoursesRaw = await getAllProfessorCourses();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );
  const coursesExtended = courses;

  coursesExtended.forEach((course: any) => {
    course.professors = profCourses
      .map((profCourse) =>
        profCourse.course_id === course.id
          ? `${profCourse.professor.user.profile?.name} ${profCourse.professor.user.profile?.surname}`
          : null,
      )
      .filter((x) => x);
  });

  return coursesExtended;
}
