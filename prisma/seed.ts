import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { announcements } from "./seedData/announcements";
import { courses } from "./seedData/courses";
import { departments } from "./seedData/departments";
import { professorCourses } from "./seedData/professorCourses";
import { professors } from "./seedData/professors";
import { profiles } from "./seedData/profiles";
import { registrars } from "./seedData/registrars";
import { studentCourses } from "./seedData/studentCourses";
import { students } from "./seedData/students";
import { studiesCurriculums } from "./seedData/studiesCurriculums";
import { users } from "./seedData/users";

const CLEANSE_DATA = false;

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV !== "development")
    throw "[ABORTED] Attempted to seed outside of development environment!";

  if (CLEANSE_DATA) {
    await prisma.department.deleteMany({});
  }
  await upsertDepartments();
  await upsertUsers();
  await upsertProfiles();
  await upsertRegistrars();
  await upsertProfessors();
  await upsertStudents();
  await upsertCourses();
  await upsertAnnouncements();
  await upsertProfessorCourses();
  await upsertStudentCourses();
  await upsertStudiesCurriculum();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function upsertUsers() {
  return Promise.all(
    users.map(async (user) =>
      prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: {
          dep_id: user.depId,
          role: user.role,
          username: user.username,
          password: {
            create: {
              hash: await bcrypt.hash(user.password, 10),
            },
          },
        },
        create: {
          id: user.id,
          dep_id: user.depId,
          role: user.role,
          username: user.username,
          password: {
            create: {
              hash: await bcrypt.hash(user.password, 10),
            },
          },
        },
      }),
    ),
  );
}

async function upsertProfiles() {
  return Promise.all(
    profiles.map((profile) =>
      prisma.profile.upsert({
        where: {
          id: profile.id,
        },
        update: {
          user_id: profile.userId,
          fullname: profile.fullname,
          email: profile.email,
          gender: profile.gender,
          phone: profile.phone,
          is_public: profile.isPublic,
        },
        create: {
          id: profile.id,
          user_id: profile.userId,
          fullname: profile.fullname,
          email: profile.email,
          gender: profile.gender,
          phone: profile.phone,
          is_public: profile.isPublic,
        },
      }),
    ),
  );
}

async function upsertDepartments() {
  return Promise.all(
    departments.map((department) =>
      prisma.department.upsert({
        where: {
          code_id: department.codeId,
        },
        update: {
          title: department.title,
          description: department.description,
          address: department.address,
          email: department.email,
          telephone: department.telephone,
          foundation_date: department.foundationDate,
        },
        create: {
          code_id: department.codeId,
          title: department.title,
          description: department.description,
          address: department.address,
          email: department.email,
          telephone: department.telephone,
          foundation_date: department.foundationDate,
        },
      }),
    ),
  );
}

async function upsertRegistrars() {
  return Promise.all(
    registrars.map((registrar) =>
      prisma.registrar.upsert({
        where: {
          id: registrar.id,
        },
        update: {
          title: registrar.title,
          user_id: registrar.userId,
        },
        create: {
          id: registrar.id,
          title: registrar.title,
          user_id: registrar.userId,
        },
      }),
    ),
  );
}

async function upsertProfessors() {
  return Promise.all(
    professors.map((professor) =>
      prisma.professor.upsert({
        where: {
          id: professor.id,
        },
        update: {
          title: professor.title,
          user_id: professor.userId,
        },
        create: {
          id: professor.id,
          title: professor.title,
          user_id: professor.userId,
        },
      }),
    ),
  );
}

async function upsertStudents() {
  return Promise.all(
    students.map((student) =>
      prisma.student.upsert({
        where: {
          id: student.id,
        },
        update: {
          enrollment_year: student.enrollment_year,
          studies_status: student.studies_status,
          user_id: student.userId,
        },
        create: {
          id: student.id,
          enrollment_year: student.enrollment_year,
          studies_status: student.studies_status,
          user_id: student.userId,
        },
      }),
    ),
  );
}

async function upsertStudentCourses() {
  return Promise.all(
    studentCourses.map((studentCourse) =>
      prisma.studentCourse.upsert({
        where: {
          student_id_course_id: {
            student_id: studentCourse.studentId,
            course_id: studentCourse.courseId,
          },
        },
        update: {
          grade: studentCourse.grade,
          is_enrolled: studentCourse.isEnrolled,
          is_following: studentCourse.isFollowing,
          is_drafted: studentCourse.isDrafted,
        },
        create: {
          student_id: studentCourse.studentId,
          course_id: studentCourse.courseId,
          grade: studentCourse.grade,
          is_enrolled: studentCourse.isEnrolled,
          is_following: studentCourse.isFollowing,
          is_drafted: studentCourse.isDrafted,
        },
      }),
    ),
  );
}

async function upsertProfessorCourses() {
  return Promise.all(
    professorCourses.map((professorCourse) =>
      prisma.professorCourse.upsert({
        where: {
          prof_id_course_id: {
            prof_id: professorCourse.profId,
            course_id: professorCourse.courseId,
          },
        },
        update: {
          is_lecturing: professorCourse.isLecturing,
          is_following: professorCourse.isFollowing,
        },
        create: {
          prof_id: professorCourse.profId,
          course_id: professorCourse.courseId,
          is_lecturing: professorCourse.isLecturing,
          is_following: professorCourse.isFollowing,
        },
      }),
    ),
  );
}

async function upsertCourses() {
  return Promise.all(
    courses.map((course) =>
      prisma.course.upsert({
        where: {
          id: course.id,
        },
        update: {
          dep_id: course.depId,
          title: course.title,
          description: course.description,
          semester: course.semester,
          is_compulsory: course.isCompulsory,
          is_postgraduate: course.isPostgraduate,
        },
        create: {
          id: course.id,
          dep_id: course.depId,
          title: course.title,
          description: course.description,
          semester: course.semester,
          is_compulsory: course.isCompulsory,
          is_postgraduate: course.isPostgraduate,
        },
      }),
    ),
  );
}

async function upsertAnnouncements() {
  return Promise.all(
    announcements.map((announcement) =>
      prisma.announcement.upsert({
        where: {
          id: announcement.id,
        },
        update: {
          title: announcement.title,
          body: announcement.body,
          course_id: announcement.courseId,
        },
        create: {
          id: announcement.id,
          title: announcement.title,
          body: announcement.body,
          course_id: announcement.courseId,
        },
      }),
    ),
  );
}

async function upsertStudiesCurriculum() {
  return Promise.all(
    studiesCurriculums.map((studiesCurriculum) =>
      prisma.studiesCurriculum.upsert({
        where: { dep_id: studiesCurriculum.depId },
        update: {
          undergrad: studiesCurriculum.undergrad as Prisma.JsonArray,
          postgrad: studiesCurriculum.postgrad as Prisma.JsonArray,
          registration_periods: studiesCurriculum.registrationPeriods as Prisma.JsonObject,
        },
        create: {
          dep_id: studiesCurriculum.depId,
          undergrad: studiesCurriculum.undergrad as Prisma.JsonArray,
          postgrad: studiesCurriculum.postgrad as Prisma.JsonArray,
          registration_periods: studiesCurriculum.registrationPeriods as Prisma.JsonObject,
        },
      }),
    ),
  );
}
