import type { Course, Professor } from "@prisma/client";
import { prisma } from "~/db.server";
export type { ProfessorCourse as ProfessorCourseModelT } from "@prisma/client";

export function getAllProfessorCourses() {
  return prisma.professorCourse.findMany({
    where: {},
    include: {
      course: true,
      professor: {
        include: {
          user: {
            select: {
              profile: {
                select: {
                  fullname: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getAllProfessorCoursesLecturing() {
  return prisma.professorCourse.findMany({
    where: {
      is_lecturing: true,
    },
    select: {
      prof_id: true,
    },
  });
}

export function getAllProfessorCoursesLectured() {
  return prisma.professorCourse.findMany({
    where: {
      is_lecturing: true,
    },
    include: {
      course: true,
      professor: {
        include: {
          user: {
            select: {
              profile: {
                select: {
                  fullname: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getProfessorCourses(profId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: profId,
    },
    include: {
      course: true,
    },
  });
}

export function getProfessorCoursesLecturing(profId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: profId,
      is_lecturing: true,
    },
    include: {
      course: true,
    },
  });
}

export function getProfessorCoursesOnCourse(courseId: Course["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      course_id: courseId,
      is_lecturing: true,
    },
    include: {
      professor: {
        include: {
          user: {
            select: {
              profile: {
                select: {
                  fullname: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getProfessorCoursesWithProfile(courseId: Course["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      course_id: courseId,
      is_lecturing: true,
    },
    include: {
      course: true,
      professor: {
        include: {
          user: {
            select: {
              username: true,
              profile: {
                select: {
                  fullname: true,
                  gender: true,
                  is_public: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export function getProfessorCoursesFollowing(profId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: profId,
      is_following: true,
    },
    include: {
      course: true,
    },
  });
}

export function getProfessorCoursesAnnouncements(profId: Professor["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: profId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
    },
  });
}

export function getProfessorCourseFollowedAnnouncements(
  profId: Professor["id"],
  courseId: Course["id"],
) {
  return prisma.professorCourse.findFirst({
    where: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
          title: true,
        },
      },
    },
  });
}

export function getProfessorCourseAnnouncements(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.findFirst({
    where: {
      prof_id: profId,
      course_id: courseId,
    },
    select: {
      course: {
        select: {
          announcements: true,
          title: true,
        },
      },
    },
  });
}

export function getProfessorCourseAnnouncementsCount(
  profId: Professor["id"],
  courseId: Course["id"],
) {
  return prisma.professorCourse.count({
    where: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
    },
  });
}

export function getProfessorCourseLecturingCount(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.count({
    where: {
      prof_id: profId,
      course_id: courseId,
      is_lecturing: true,
    },
  });
}

export function getProfessorCoursesLecturingCount(profId: Professor["id"]) {
  return prisma.professorCourse.count({
    where: {
      prof_id: profId,
      is_lecturing: true,
    },
  });
}

export function getProfessorCoursesFollowingCount(profId: Professor["id"]) {
  return prisma.professorCourse.count({
    where: {
      prof_id: profId,
      is_following: true,
    },
  });
}

export function assignProfessorCourse(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.upsert({
    where: {
      prof_id_course_id: {
        prof_id: profId,
        course_id: courseId,
      },
    },
    update: {
      is_following: true,
      is_lecturing: true,
    },
    create: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
      is_lecturing: true,
    },
  });
}

export function followProfessorCourse(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.upsert({
    where: {
      prof_id_course_id: {
        prof_id: profId,
        course_id: courseId,
      },
    },
    update: {
      is_following: true,
    },
    create: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
      is_lecturing: false,
    },
  });
}

export function unfollowProfessorCourse(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.update({
    where: {
      prof_id_course_id: {
        prof_id: profId,
        course_id: courseId,
      },
    },
    data: {
      is_following: false,
    },
  });
}

export function assignProfessorToCourse(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.create({
    data: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
      is_lecturing: true,
    },
  });
}

export function unregisterProfessorFromCourse(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.delete({
    where: {
      prof_id_course_id: {
        prof_id: profId,
        course_id: courseId,
      },
    },
  });
}

// includes the "has_seen" field, useful for differenciating seen/unseen announcements
function getProfessorCourseAnnouncementsGenerous(profId: Professor["id"], courseId: Course["id"]) {
  return prisma.professorCourse.findMany({
    where: {
      prof_id: profId,
      course_id: courseId,
      is_following: true,
    },
    select: {
      course: {
        select: {
          announcements: true,
        },
      },
      professor: {
        select: {
          user: {
            select: {
              userAnnouncements: true,
            },
          },
        },
      },
    },
  });
}
