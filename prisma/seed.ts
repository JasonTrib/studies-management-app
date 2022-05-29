import { users } from "./seedData/users";
import { profiles } from "./seedData/profiles";
import { registrars } from "./seedData/registrars";
import { professors } from "./seedData/professors";
import { students } from "./seedData/students";
import { studentCourses } from "./seedData/studentCourses";
import { courses } from "./seedData/courses";
import { courseAnnouncements } from "./seedData/courseAnnouncements";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const UPSERT = false;

async function main() {
  if (process.env.NODE_ENV !== "development")
    throw "[ABORTED] Attempted to seed outside of development environment!";

  if (UPSERT) {
    await upsertUsers();
    await upsertProfiles();
    await upsertRegistrars();
    await upsertProfessors();
    await upsertCourses();
    await upsertStudents();
    await upsertCourseAnnouncements();
    await upsertStudentCourses();
  } else {
    await prisma.courseAnnouncement.deleteMany({});
    await prisma.studentCourse.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.professor.deleteMany({});
    await prisma.registrar.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.password.deleteMany({});
    await prisma.user.deleteMany({});

    await createUsers();
    await createProfiles();
    await createRegistrars();
    await createProfessors();
    await createCourses();
    await createStudents();
    await createCourseAnnouncements();
    await createStudentCourses();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function upsertUsers() {
  for (let i = 0; i < users.length; i++) {
    await prisma.user.upsert({
      where: {
        id: users[i].id,
      },
      update: {},
      create: {
        id: users[i].id,
        role: users[i].role,
        username: users[i].username,
        password: {
          create: {
            hash: "1234",
          },
        },
      },
    });
  }
}

async function upsertProfiles() {
  for (let i = 0; i < profiles.length; i++) {
    await prisma.profile.upsert({
      where: {
        id: profiles[i].id,
      },
      update: {},
      create: {
        id: profiles[i].id,
        name: profiles[i].name,
        surname: profiles[i].surname,
        email: profiles[i].email,
      },
    });
  }
}

async function upsertRegistrars() {
  for (let i = 0; i < registrars.length; i++) {
    await prisma.registrar.upsert({
      where: {
        id: registrars[i].id,
      },
      update: {},
      create: {
        id: registrars[i].id,
        title: registrars[i].title,
        department: registrars[i].department,
        user_id: registrars[i].userId,
        profile_id: registrars[i].profileId,
      },
    });
  }
}

async function upsertProfessors() {
  for (let i = 0; i < professors.length; i++) {
    await prisma.professor.upsert({
      where: {
        id: professors[i].id,
      },
      update: {},
      create: {
        id: professors[i].id,
        title: professors[i].title,
        department: professors[i].department,
        user_id: professors[i].userId,
        profile_id: professors[i].profileId,
      },
    });
  }
}

async function upsertCourses() {
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.upsert({
      where: {
        id: courses[i].id,
      },
      update: {},
      create: {
        id: courses[i].id,
        title: courses[i].title,
        semester: courses[i].semester,
        department: courses[i].department,
        is_elective: courses[i].isElective,
        is_postgraduate: courses[i].isPostgraduate,
        professor_id: courses[i].professorId,
      },
    });
  }
}

async function upsertStudents() {
  for (let i = 0; i < students.length; i++) {
    await prisma.student.upsert({
      where: {
        id: students[i].id,
      },
      update: {},
      create: {
        id: students[i].id,
        department: students[i].department,
        enrollment_year: students[i].enrollment_year,
        studies_status: students[i].studies_status,
        user_id: students[i].userId,
        profile_id: students[i].profileId,
      },
    });
  }
}

async function upsertCourseAnnouncements() {
  for (let i = 0; i < courseAnnouncements.length; i++) {
    await prisma.courseAnnouncement.upsert({
      where: {
        id: courseAnnouncements[i].id,
      },
      update: {},
      create: {
        id: courseAnnouncements[i].id,
        title: courseAnnouncements[i].title,
        body: courseAnnouncements[i].body,
        course_id: courseAnnouncements[i].courseId,
      },
    });
  }
}

async function upsertStudentCourses() {
  for (let i = 0; i < studentCourses.length; i++) {
    await prisma.studentCourse.upsert({
      where: {
        student_id_course_id: {
          student_id: studentCourses[i].studentId,
          course_id: studentCourses[i].courseId,
        },
      },
      update: {},
      create: {
        student_id: studentCourses[i].studentId,
        course_id: studentCourses[i].courseId,
        grade: studentCourses[i].grade,
        is_enrolled: studentCourses[i].isEnrolled,
        is_following: studentCourses[i].isFollowing,
      },
    });
  }
}

async function createUsers() {
  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({
      data: {
        id: users[i].id,
        role: users[i].role,
        username: users[i].username,
        password: {
          create: {
            hash: "1234",
          },
        },
      },
    });
  }
}

async function createProfiles() {
  for (let i = 0; i < profiles.length; i++) {
    await prisma.profile.create({
      data: {
        id: profiles[i].id,
        name: profiles[i].name,
        surname: profiles[i].surname,
        email: profiles[i].email,
      },
    });
  }
}

async function createRegistrars() {
  for (let i = 0; i < registrars.length; i++) {
    await prisma.registrar.create({
      data: {
        id: registrars[i].id,
        title: registrars[i].title,
        department: registrars[i].department,
        user_id: registrars[i].userId,
        profile_id: registrars[i].profileId,
      },
    });
  }
}

async function createProfessors() {
  for (let i = 0; i < professors.length; i++) {
    await prisma.professor.create({
      data: {
        id: professors[i].id,
        title: professors[i].title,
        department: professors[i].department,
        user_id: professors[i].userId,
        profile_id: professors[i].profileId,
      },
    });
  }
}

async function createCourses() {
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.create({
      data: {
        id: courses[i].id,
        title: courses[i].title,
        semester: courses[i].semester,
        department: courses[i].department,
        is_elective: courses[i].isElective,
        is_postgraduate: courses[i].isPostgraduate,
        professor_id: courses[i].professorId,
      },
    });
  }
}

async function createStudents() {
  for (let i = 0; i < students.length; i++) {
    await prisma.student.create({
      data: {
        id: students[i].id,
        department: students[i].department,
        enrollment_year: students[i].enrollment_year,
        studies_status: students[i].studies_status,
        user_id: students[i].userId,
        profile_id: students[i].profileId,
      },
    });
  }
}

async function createCourseAnnouncements() {
  for (let i = 0; i < courseAnnouncements.length; i++) {
    await prisma.courseAnnouncement.create({
      data: {
        id: courseAnnouncements[i].id,
        title: courseAnnouncements[i].title,
        body: courseAnnouncements[i].body,
        course_id: courseAnnouncements[i].courseId,
      },
    });
  }
}

async function createStudentCourses() {
  for (let i = 0; i < studentCourses.length; i++) {
    await prisma.studentCourse.create({
      data: {
        student_id: studentCourses[i].studentId,
        course_id: studentCourses[i].courseId,
        grade: studentCourses[i].grade,
        is_enrolled: studentCourses[i].isEnrolled,
        is_following: studentCourses[i].isFollowing,
      },
    });
  }
}
