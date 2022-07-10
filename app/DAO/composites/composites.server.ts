import type { Course, Department, Student, User } from "@prisma/client";
import { getAllAnnoucements } from "../announcementDAO.server";
import { getCourses } from "../courseDAO.server";
import { getAllProfessorCourses, getProfessorCoursesOnCourse } from "../professorCourseDAO.server";
import {
  getStudentCourses,
  getStudentCoursesFollowed,
  getStudentCoursesFollowedCount,
  getStudentCoursesRegisteredCount,
} from "../studentCourseDAO.server";

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

  const studentCourses = studentCoursesRaw.map((x) => ({
    ...x.course,
    student: { grade: x.grade, isEnrolled: x.is_enrolled, isFollowing: x.is_following },
  }));
  const profCourses = studentCourses.flatMap((studentCourse) =>
    professorCoursesRaw.filter((professorCourse) => professorCourse.course_id === studentCourse.id),
  );

  const coursesRegistered = studentCourses.map((course) => {
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        name: prof.professor.user.profile?.name,
        surname: prof.professor.user.profile?.surname,
      })),
    };
  });

  return coursesRegistered;
}

export async function getCoursesExtended(depId: Department["title_id"], userId: Student["id"]) {
  const courses = await getCourses(depId);
  const studentCourses = await getStudentCourses(userId);
  const profCoursesRaw = await getAllProfessorCourses();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );

  const coursesExtended = courses.map((course) => {
    const studentCourseMatch = studentCourses.filter(
      (studentCourse) => studentCourse.course_id === course.id,
    )[0];
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      student: {
        isEnrolled: studentCourseMatch?.is_enrolled || false,
        isFollowing: studentCourseMatch?.is_following || false,
      },
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        name: prof.professor.user.profile?.name,
        surname: prof.professor.user.profile?.surname,
      })),
    };
  });

  return coursesExtended;
}

export async function getCourseExtended(courseId: Course["id"]) {
  const profCourses = await getProfessorCoursesOnCourse(courseId);
  const studentsRegisteredCount = await getStudentCoursesRegisteredCount(courseId);
  const studentsFollowingCount = await getStudentCoursesFollowedCount(courseId);

  const courseExtended = {
    ...profCourses[0].course,
    students_registered: studentsRegisteredCount,
    students_following: studentsFollowingCount,
    professors: profCourses.map((prof) => ({
      id: prof.prof_id,
      name: prof.professor.user.profile?.name,
      surname: prof.professor.user.profile?.surname,
    })),
  };

  return courseExtended;
}
