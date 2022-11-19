import type { Course, Department, Gender, Professor, Student, User } from "@prisma/client";
import { getAllAnnouncements } from "../announcementDAO.server";
import {
  getAllCoursesShort,
  getCompulsoryCoursesRegistration,
  getCourse,
  getCourses,
  getCoursesCount,
  getCoursesRegistration,
  getPostgradCourses,
  getUndergradCourses,
} from "../courseDAO.server";
import { getDepartment, getDepartments } from "../departmentDAO.server";
import {
  getAllProfessorCoursesLectured,
  getProfessorCourseAnnouncements,
  getProfessorCourseAnnouncementsCount,
  getProfessorCourseLecturingCount,
  getProfessorCourses,
  getProfessorCoursesFollowing,
  getProfessorCoursesFollowingCount,
  getProfessorCoursesLecturing,
  getProfessorCoursesLecturingCount,
  getProfessorCoursesOnCourse,
  getProfessorCoursesWithProfile,
} from "../professorCourseDAO.server";
import {
  createAndRegisterStudentCourses,
  getAllStudentCoursesEnrolled,
  getStudentCourseAnnouncements,
  getStudentCourseAnnouncementsCount,
  getStudentCourses,
  getStudentCoursesEnrolled,
  getStudentCoursesFollowing,
  getStudentCoursesFollowingCount,
  getStudentCoursesFollowingCountGivenCourse,
  getStudentCoursesRegisteredCount,
  getStudentCoursesRegisteredCountGivenCourse,
  registerStudentCourses,
} from "../studentCourseDAO.server";
import {
  getAllUsersExceptSuperadminsShort,
  getDepartmentProfessors,
  getDepartmentRegistrars,
  getDepartmentStudents,
  getProfessorUserProfile,
  getStudentUserProfile,
  getUsersCount,
} from "../userDAO.server";

export async function getAnnouncementsFollowedAsStudent(studentId: Student["id"]) {
  const coursesFollowed = await getStudentCoursesFollowing(studentId);
  const announcements = await getAllAnnouncements();

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  const announcementsFollowedSorted = [...announcementsFollowed].sort((a, b) =>
    a.created_at >= b.created_at ? -1 : 1,
  );

  return announcementsFollowedSorted;
}

export async function getAnnouncementsFollowedAsProfessor(profId: Professor["id"]) {
  const coursesFollowed = await getProfessorCoursesFollowing(profId);
  const announcements = await getAllAnnouncements();

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  const announcementsFollowedSorted = [...announcementsFollowed].sort((a, b) =>
    a.created_at >= b.created_at ? -1 : 1,
  );

  return announcementsFollowedSorted;
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

export async function getCoursesEnrolledWithGradeAccess(
  studentId: Student["id"],
  activeUserId: User["id"],
) {
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
      grade: professors.some((prof) => prof.professor.user_id === activeUserId)
        ? course.grade
        : null,
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

export async function getCoursesExtended(depId: Department["code_id"]) {
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
  depId: Department["code_id"],
  studentId: Student["id"],
) {
  const courses = await getCourses(depId);
  const studentCourses = await getStudentCourses(studentId);
  const profCoursesRaw = await getAllProfessorCoursesLectured();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );

  const coursesExtended = courses.map((course) => {
    const studentCourseMatch = studentCourses.find(
      (studentCourse) => studentCourse.course_id === course.id,
    );
    const professors = profCourses.filter((profCourse) => profCourse.course_id === course.id);

    return {
      ...course,
      isEnrolled: studentCourseMatch?.is_enrolled || false,
      isFollowing: studentCourseMatch?.is_following || false,
      grade: studentCourseMatch?.grade,
      professors: professors.map((prof) => ({
        id: prof.professor.id,
        fullname: prof.professor.user.profile?.fullname,
      })),
    };
  });

  return coursesExtended;
}

export async function getCoursesAsProfessorExtended(
  depId: Department["code_id"],
  profId: Professor["id"],
) {
  const courses = await getCourses(depId);
  const professorCourses = await getProfessorCourses(profId);
  const profCoursesRaw = await getAllProfessorCoursesLectured();

  const profCourses = courses.flatMap((course) =>
    profCoursesRaw.filter((profCourse) => profCourse.course_id === course.id),
  );

  const coursesExtended = courses.map((course) => {
    const profCourseMatch = professorCourses.find(
      (profCourse) => profCourse.course_id === course.id,
    );
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
  const studentsRegisteredCount = await getStudentCoursesRegisteredCountGivenCourse(courseId);
  const studentsFollowingCount = await getStudentCoursesFollowingCountGivenCourse(courseId);

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

export async function getRegistrarUsersExtended(dep: Department["code_id"], userId?: User["id"]) {
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

export async function getProfessorUsersExtended(dep: Department["code_id"], userId?: User["id"]) {
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

export async function getStudentUsersExtended(dep: Department["code_id"], userId?: User["id"]) {
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

export async function getProfessorUserExtended(userId: User["id"]) {
  const user = await getProfessorUserProfile(userId);
  if (!user?.professor?.id) return null;
  const coursesFollowing = await getProfessorCoursesFollowingCount(user.professor.id);
  const coursesLecturing = await getProfessorCoursesLecturingCount(user.professor.id);

  const userExtended = {
    ...user,
    professor: {
      ...user?.professor,
      coursesFollowingNumber: coursesFollowing,
      coursesLecturingNumber: coursesLecturing,
    },
  };

  return userExtended;
}

export async function getStudentUserExtended(userId: User["id"]) {
  const user = await getStudentUserProfile(userId);
  if (!user?.student?.id) return null;
  const coursesFollowing = await getStudentCoursesFollowingCount(user.student.id);
  const coursesEnrolled = await getStudentCoursesRegisteredCount(user.student.id);

  const userExtended = {
    ...user,
    student: {
      ...user?.student,
      coursesFollowingNumber: coursesFollowing,
      coursesEnrolledNumber: coursesEnrolled,
    },
  };

  return userExtended;
}

export async function getProfessorUserShortExtended(courseId: Course["id"]) {
  const profCourses = await getProfessorCoursesWithProfile(courseId);

  const profsShortExtended = profCourses.map((profCourse) => {
    return {
      id: profCourse.professor.user_id,
      username: profCourse.professor.user.username,
      profile: profCourse.professor.user.profile,
      professor: {
        id: profCourse.professor.id,
        title: profCourse.professor.title,
      },
    };
  });

  return profsShortExtended;
}

export async function getDepartmentExtended(depId: Department["code_id"]) {
  const department = await getDepartment(depId);
  if (!department) return null;
  const coursesCount = await getCoursesCount(depId);
  const usersCount = await getUsersCount(depId);

  const departmentExtended = {
    ...department,
    users: usersCount,
    courses: coursesCount,
  };

  return departmentExtended;
}

export async function getOtherDepartmentsExtended(depId: Department["code_id"]) {
  const departments = await getDepartments();
  const courses = await getAllCoursesShort();
  const users = await getAllUsersExceptSuperadminsShort();

  const otherDepartmentsExtended = departments
    .map((dep) =>
      dep.code_id === depId
        ? null
        : {
            ...dep,
            courses: courses.filter((course) => course.dep_id === dep.code_id).length,
            users: users.filter((user) => user.dep_id === dep.code_id).length,
          },
    )
    .filter((x) => x);

  return otherDepartmentsExtended;
}

export async function getUndergradCurriculumCourses(depId: Department["code_id"]) {
  const courses = await getUndergradCourses(depId);

  const scaffold = [...Array(8)].map(() => ({ semester: { compulsories: 0, electives: 0 } }));

  courses.forEach((course) =>
    course.is_compulsory
      ? (scaffold[course.semester - 1].semester.compulsories += 1)
      : (scaffold[course.semester - 1].semester.electives += 1),
  );
  const undergradCurriculumData = [...scaffold];

  return undergradCurriculumData;
}

export async function getPostgradCurriculumCourses(depId: Department["code_id"]) {
  const courses = await getPostgradCourses(depId);

  const scaffold = [...Array(4)].map(() => ({ semester: { compulsories: 0, electives: 0 } }));

  courses.forEach((course) =>
    course.is_compulsory
      ? (scaffold[course.semester - 1].semester.compulsories += 1)
      : (scaffold[course.semester - 1].semester.electives += 1),
  );
  const postgradCurriculumData = [...scaffold];

  return postgradCurriculumData;
}

export async function getStudentCoursesRegistration(
  depId: Department["code_id"],
  studentId: Student["id"],
  semester: number,
  isPostgrad: boolean,
) {
  const courses = await getCoursesRegistration(depId, semester, isPostgrad);
  const studentCourses = await getStudentCourses(studentId);
  const profCourses = await getAllProfessorCoursesLectured();

  const coursesExtended = courses
    .map((course) => {
      const matchingCourse = studentCourses.find(
        (studCourse) => course.id === studCourse.course_id,
      );
      const professors = profCourses.filter((profCourse) => course.id === profCourse.course_id);

      return {
        ...course,
        professors: professors.map((prof) => ({
          id: prof.professor.id,
          fullname: prof.professor.user.profile?.fullname,
        })),
        grade: matchingCourse?.grade || null,
        isDrafted: matchingCourse?.is_drafted || false,
      };
    })
    .filter((x) => x);

  return coursesExtended;
}

export async function registerStudentCoursesCompulsories(
  depId: Department["code_id"],
  studentId: Student["id"],
  semester: number,
  isPostgrad: boolean,
) {
  const compulsories = await getCompulsoryCoursesRegistration(depId, semester, isPostgrad);
  const compulsoriesIds = compulsories.map((compulsory) => compulsory.id);

  await createAndRegisterStudentCourses(studentId, compulsoriesIds);
  await registerStudentCourses(studentId, compulsoriesIds, false);
}
