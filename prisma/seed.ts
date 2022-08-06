import { PrismaClient } from "@prisma/client";
import { departments } from "./seedData/departments";
import { users } from "./seedData/users";
import { profiles } from "./seedData/profiles";
import { registrars } from "./seedData/registrars";
import { professors } from "./seedData/professors";
import { students } from "./seedData/students";
import { courses } from "./seedData/courses";
import { announcements } from "./seedData/announcements";
import { professorCourses } from "./seedData/professorCourses";
import { studentCourses } from "./seedData/studentCourses";
import { userAnnouncements } from "./seedData/userAnnnouncements";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UPSERT = false;

async function main() {
  if (process.env.NODE_ENV !== "development")
    throw "[ABORTED] Attempted to seed outside of development environment!";

  if (UPSERT) {
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
    await upsertUserAnnouncements();
  } else {
    await prisma.department.deleteMany({});

    await createDepartments();
    await createUsers();
    await createProfiles();
    await createRegistrars();
    await createProfessors();
    await createStudents();
    await createCourses();
    await createAnnouncements();
    await createProfessorCourses();
    await createStudentCourses();
    await createUserAnnouncements();
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
        dep_id: users[i].depId,
        role: users[i].role,
        username: users[i].username,
        password: {
          create: {
            hash: await bcrypt.hash(users[i].password, 10),
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
        fullname: profiles[i].fullname,
        email: profiles[i].email,
        user_id: profiles[i].userId,
      },
    });
  }
}

async function upsertDepartments() {
  for (let i = 0; i < departments.length; i++) {
    await prisma.department.upsert({
      where: {
        title_id: departments[i].titleId,
      },
      update: {},
      create: {
        title_id: departments[i].titleId,
        full_title: departments[i].fullTitle,
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
        user_id: registrars[i].userId,
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
        user_id: professors[i].userId,
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
        enrollment_year: students[i].enrollment_year,
        studies_status: students[i].studies_status,
        user_id: students[i].userId,
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

async function upsertProfessorCourses() {
  for (let i = 0; i < professorCourses.length; i++) {
    await prisma.professorCourse.upsert({
      where: {
        prof_id_course_id: {
          prof_id: professorCourses[i].profId,
          course_id: professorCourses[i].courseId,
        },
      },
      update: {},
      create: {
        prof_id: professorCourses[i].profId,
        course_id: professorCourses[i].courseId,
        is_lecturing: professorCourses[i].isLecturing,
        is_following: professorCourses[i].isFollowing,
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
        dep_id: courses[i].depId,
        title: courses[i].title,
        description: courses[i].description,
        semester: courses[i].semester,
        is_elective: courses[i].isElective,
        is_postgraduate: courses[i].isPostgraduate,
      },
    });
  }
}

async function upsertAnnouncements() {
  for (let i = 0; i < announcements.length; i++) {
    await prisma.announcement.upsert({
      where: {
        id: announcements[i].id,
      },
      update: {},
      create: {
        id: announcements[i].id,
        title: announcements[i].title,
        body: announcements[i].body,
        course_id: announcements[i].courseId,
      },
    });
  }
}

async function upsertUserAnnouncements() {
  for (let i = 0; i < userAnnouncements.length; i++) {
    await prisma.userAnnouncement.upsert({
      where: { id: userAnnouncements[i].id },
      update: {},
      create: {
        id: userAnnouncements[i].id,
        user_id: userAnnouncements[i].userId,
        announcement_id: userAnnouncements[i].annId,
        has_posted: userAnnouncements[i].hasPosted,
        has_seen: userAnnouncements[i].hasSeen,
      },
    });
  }
}

async function createUsers() {
  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({
      data: {
        // id: users[i].id,
        dep_id: users[i].depId,
        role: users[i].role,
        username: users[i].username,
        password: {
          create: {
            hash: await bcrypt.hash(users[i].password, 10),
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
        // id: profiles[i].id,
        fullname: profiles[i].fullname,
        email: profiles[i].email,
        user_id: profiles[i].userId,
      },
    });
  }
}

async function createDepartments() {
  for (let i = 0; i < departments.length; i++) {
    await prisma.department.create({
      data: {
        title_id: departments[i].titleId,
        full_title: departments[i].fullTitle,
      },
    });
  }
}

async function createRegistrars() {
  for (let i = 0; i < registrars.length; i++) {
    await prisma.registrar.create({
      data: {
        // id: registrars[i].id,
        title: registrars[i].title,
        user_id: registrars[i].userId,
      },
    });
  }
}

async function createProfessors() {
  for (let i = 0; i < professors.length; i++) {
    await prisma.professor.create({
      data: {
        // id: professors[i].id,
        title: professors[i].title,
        user_id: professors[i].userId,
      },
    });
  }
}

async function createStudents() {
  for (let i = 0; i < students.length; i++) {
    await prisma.student.create({
      data: {
        // id: students[i].id,
        enrollment_year: students[i].enrollment_year,
        studies_status: students[i].studies_status,
        user_id: students[i].userId,
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

async function createProfessorCourses() {
  for (let i = 0; i < professorCourses.length; i++) {
    await prisma.professorCourse.create({
      data: {
        prof_id: professorCourses[i].profId,
        course_id: professorCourses[i].courseId,
        is_lecturing: professorCourses[i].isLecturing,
        is_following: professorCourses[i].isFollowing,
      },
    });
  }
}

async function createCourses() {
  for (let i = 0; i < courses.length; i++) {
    await prisma.course.create({
      data: {
        // id: courses[i].id,
        dep_id: courses[i].depId,
        title: courses[i].title,
        description: courses[i].description,
        semester: courses[i].semester,
        is_elective: courses[i].isElective,
        is_postgraduate: courses[i].isPostgraduate,
      },
    });
  }
}

async function createAnnouncements() {
  for (let i = 0; i < announcements.length; i++) {
    await prisma.announcement.create({
      data: {
        // id: announcements[i].id,
        title: announcements[i].title,
        body: announcements[i].body,
        course_id: announcements[i].courseId,
      },
    });
  }
}

async function createUserAnnouncements() {
  for (let i = 0; i < userAnnouncements.length; i++) {
    await prisma.userAnnouncement.create({
      data: {
        id: userAnnouncements[i].id,
        user_id: userAnnouncements[i].userId,
        announcement_id: userAnnouncements[i].annId,
        has_posted: userAnnouncements[i].hasPosted,
        has_seen: userAnnouncements[i].hasSeen,
      },
    });
  }
}
