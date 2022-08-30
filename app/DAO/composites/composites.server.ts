import type { Course, Department, Gender, Professor, Student, User } from "@prisma/client";
import { getAllAnnoucements } from "../announcementDAO.server";
import { getCourse, getCourses } from "../courseDAO.server";
import {
  getAllProfessorCoursesLectured,
  getProfessorCourseAnnouncements,
  getProfessorCourseAnnouncementsCount,
  getProfessorCourseLecturingCount,
  getProfessorCourses,
  getProfessorCoursesFollowing,
  getProfessorCoursesLecturing,
  getProfessorCoursesOnCourse,
} from "../professorCourseDAO.server";
import {
  getAllStudentCoursesEnrolled,
  getStudentCourseAnnouncements,
  getStudentCourseAnnouncementsCount,
  getStudentCourses,
  getStudentCoursesEnrolled,
  getStudentCoursesFollowing,
  getStudentCoursesFollowingCount,
  getStudentCoursesRegisteredCount,
} from "../studentCourseDAO.server";
import {
  getDepartmentProfessors,
  getDepartmentRegistrars,
  getDepartmentStudents,
} from "../userDAO.server";

export async function getAnnouncementsFollowedAsStudent(studentId: Student["id"]) {
  const coursesFollowed = await getStudentCoursesFollowing(studentId);
  const announcements = await getAllAnnoucements();

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  return announcementsFollowed;
}

export async function getAnnouncementsFollowedAsProfessor(profId: Professor["id"]) {
  const coursesFollowed = await getProfessorCoursesFollowing(profId);
  const announcements = await getAllAnnoucements();

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  return announcementsFollowed;
}

export async function getCoursesEnrolled(studentId: Student["id"]) {
  const studentCoursesRaw = await getStudentCoursesEnrolled(studentId);
  const professorCoursesRaw = await getAllProfessorCoursesLectured();

  const studentCourses = studentCoursesRaw.map((x) => ({
    ...x.course,
    grade: x.grade,
    isEnrolled: x.is_enrolled,
    isFollowing: x.is_following,
  }));
  const profCourses = studentCourses.flatMap((studentCourse) =>
    professorCoursesRaw.filter((professorCourse) => professorCourse.course_id === studentCourse.id),
  );

  const coursesEnrolled = studentCourses.map((course) => {
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesEnrolled;
}

export async function getCoursesLecturing(profId: Professor["id"]) {
  const profCoursesRaw = await getProfessorCoursesLecturing(profId);
  const allProfsCoursesRaw = await getAllProfessorCoursesLectured();

  const profCourses = profCoursesRaw.map((x) => ({
    ...x.course,
    isLecturing: x.is_lecturing,
    isFollowing: x.is_following,
  }));
  const profsCourses = profCourses.flatMap((profCourse) =>
    allProfsCoursesRaw.filter((professorCourse) => professorCourse.course_id === profCourse.id),
  );

  const coursesLecturing = profCourses.map((course) => {
    const professors = profsCourses.filter((profsCourse) => profsCourse.course_id === course.id);

    return {
      ...course,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesLecturing;
}

export async function getCoursesExtended(depId: Department["title_id"]) {
  const courses = await getCourses(depId);
  const profCoursesRaw = await getAllProfessorCoursesLectured();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );

  const coursesExtended = courses.map((course) => {
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesExtended;
}

export async function getCoursesAsStudentExtended(
  depId: Department["title_id"],
  studentId: Student["id"],
) {
  const courses = await getCourses(depId);
  const studentCourses = await getStudentCourses(studentId);
  const profCoursesRaw = await getAllProfessorCoursesLectured();

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
      isEnrolled: studentCourseMatch?.is_enrolled || false,
      isFollowing: studentCourseMatch?.is_following || false,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesExtended;
}

export async function getCoursesAsProfessorExtended(
  depId: Department["title_id"],
  profId: Professor["id"],
) {
  const courses = await getCourses(depId);
  const professorCourses = await getProfessorCourses(profId);
  const profCoursesRaw = await getAllProfessorCoursesLectured();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );

  const coursesExtended = courses.map((course) => {
    const profCourseMatch = professorCourses.filter(
      (profCourse) => profCourse.course_id === course.id,
    )[0];
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      isLecturing: profCourseMatch?.is_lecturing || false,
      isFollowing: profCourseMatch?.is_following || false,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesExtended;
}

export async function getCourseExtended(courseId: Course["id"]) {
  const course = await getCourse(courseId);
  if (!course) return null;
  const profCourses = await getProfessorCoursesOnCourse(courseId);
  const studentsRegisteredCount = await getStudentCoursesRegisteredCount(courseId);
  const studentsFollowingCount = await getStudentCoursesFollowingCount(courseId);

  const courseExtended = {
    ...course,
    students_registered: studentsRegisteredCount,
    students_following: studentsFollowingCount,
    professors: profCourses.map((prof) => ({
      id: prof.prof_id,
      fullname: prof.professor.user.profile?.fullname,
    })),
  };

  return courseExtended;
}

export async function getAnnouncementsOnStudentFollowedCourse(
  studentId: Student["id"],
  courseId: Course["id"],
) {
  const studentCourseRaw = await getStudentCourseAnnouncements(studentId, courseId);

  const announcements = studentCourseRaw?.course.announcements.map((ann) => ({
    ...ann,
    course: { title: studentCourseRaw?.course.title },
  }));

  return announcements;
}

export async function getAnnouncementsOnProfessorFollowedCourse(
  profId: Professor["id"],
  courseId: Course["id"],
) {
  const profCourseRaw = await getProfessorCourseAnnouncements(profId, courseId);

  const announcements = profCourseRaw?.course.announcements.map((ann) => ({
    ...ann,
    course: { title: profCourseRaw?.course.title },
  }));

  return announcements;
}

export async function getIsStudentFollowingCourse(
  studentId: Student["id"],
  courseId: Course["id"],
) {
  const count = await getStudentCourseAnnouncementsCount(studentId, courseId);

  return !!count;
}

export async function getIsProfessorFollowingCourse(
  profId: Professor["id"],
  courseId: Course["id"],
) {
  const count = await getProfessorCourseAnnouncementsCount(profId, courseId);

  return !!count;
}

export async function getIsProfessorLecturingCourse(
  profId: Professor["id"],
  courseId: Course["id"],
) {
  const count = await getProfessorCourseLecturingCount(profId, courseId);

  return !!count;
}

export async function getRegistrarUsersExtended(
  dep: Department["full_title"],
  userId?: User["id"],
) {
  const registrars = await getDepartmentRegistrars(dep);

  const registrarUsersExtended = registrars.map((registrar) => {
    const profile = (
      registrar.profile?.is_public || (userId !== undefined && userId === registrar.id)
        ? { ...registrar.profile }
        : { email: registrar.profile?.email, is_public: registrar.profile?.is_public }
    ) as {
      fullname?: string | null;
      email: string | null;
      gender?: Gender | null;
      is_public: boolean;
    };

    return {
      ...registrar,
      isCurrent: userId !== undefined && userId === registrar.id,
      registrar: {
        ...(registrar.registrar as Exclude<typeof registrar.registrar, null>),
      },
      profile: profile,
    };
  });

  return registrarUsersExtended;
}

export async function getProfessorUsersExtended(
  dep: Department["full_title"],
  userId?: User["id"],
) {
  const professors = await getDepartmentProfessors(dep);
  const profCoursesEnrolled = await getAllProfessorCoursesLectured();

  const professorUsersExtended = professors.map((profUser) => {
    const coursesEnrolledNumber = profCoursesEnrolled.reduce(
      (prev, curr) => (profUser.professor?.id === curr.prof_id ? prev + 1 : prev),
      0,
    );

    const profile = (
      profUser.profile?.is_public || (userId !== undefined && userId === profUser.id)
        ? { ...profUser.profile }
        : { email: profUser.profile?.email, is_public: profUser.profile?.is_public }
    ) as {
      fullname?: string | null;
      email: string | null;
      gender?: Gender | null;
      is_public: boolean;
    };

    return {
      ...profUser,
      isCurrent: userId !== undefined && userId === profUser.id,
      professor: {
        ...(profUser.professor as Exclude<typeof profUser.professor, null>),
        coursesNumber: coursesEnrolledNumber,
      },
      profile: profile,
    };
  });

  return professorUsersExtended;
}

export async function getStudentUsersExtended(dep: Department["full_title"], userId?: User["id"]) {
  const students = await getDepartmentStudents(dep);
  const studentCoursesEnrolled = await getAllStudentCoursesEnrolled();

  const studentUsersExtended = students.map((studentUser) => {
    const coursesEnrolledNumber = studentCoursesEnrolled.reduce(
      (prev, curr) => (studentUser.student?.id === curr.student_id ? prev + 1 : prev),
      0,
    );

    const profile = (
      studentUser.profile?.is_public || (userId !== undefined && userId === studentUser.id)
        ? { ...studentUser.profile }
        : { email: studentUser.profile?.email, is_public: studentUser.profile?.is_public }
    ) as {
      fullname?: string | null;
      email: string | null;
      gender?: Gender | null;
      is_public: boolean;
    };

    return {
      ...studentUser,
      isCurrent: userId !== undefined && userId === studentUser.id,
      student: {
        ...(studentUser.student as Exclude<typeof studentUser.student, null>),
        coursesNumber: coursesEnrolledNumber,
      },
      profile: profile,
    };
  });

  return studentUsersExtended;
}
