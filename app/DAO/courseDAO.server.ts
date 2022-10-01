import { prisma } from "~/db.server";
import type { Announcement, Course } from "@prisma/client";
export type { Course as CourseModelT } from "@prisma/client";

export function getAllCourses() {
  return prisma.course.findMany({});
}

export function getAllCoursesShort() {
  return prisma.course.findMany({
    select: {
      dep_id: true,
    },
  });
}

export function getCourses(depId: Course["dep_id"]) {
  return prisma.course.findMany({
    where: {
      dep_id: depId,
    },
  });
}

export function getCoursesCount(depId: Course["dep_id"]) {
  return prisma.course.count({
    where: {
      dep_id: depId,
    },
  });
}

export function getCourse(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
  });
}

export function getCoursesAnnouncements(depId: Course["dep_id"]) {
  return prisma.course.findMany({
    where: {
      dep_id: depId,
    },
    select: {
      id: true,
      title: true,
      announcements: true,
    },
  });
}

export function getCourseAnnouncements(id: Course["id"]) {
  return prisma.course.findUnique({
    where: { id },
    select: {
      announcements: true,
    },
  });
}

export type courseDataT = {
  id?: number;
  dep_id: string;
  title: string;
  description?: string;
  semester: number;
  is_elective: boolean;
  is_postgraduate: boolean;
  is_public: boolean;
  updated_at?: string;
};

export function createCourse(data: courseDataT) {
  return prisma.course.create({
    data: {
      dep_id: data.dep_id,
      title: data.title,
      description: data.description,
      semester: data.semester,
      is_elective: data.is_elective,
      is_postgraduate: data.is_postgraduate,
      is_public: data.is_public,
    },
  });
}

export function getCourseIdFromAnnouncement(annId: Announcement["id"]) {
  return prisma.course.findFirst({
    where: {
      announcements: {
        some: {
          id: annId,
        },
      },
    },
    select: {
      id: true,
    },
  });
}

export function editCourse(data: Omit<courseDataT, "dep_id">) {
  return prisma.course.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      description: data.description,
      semester: data.semester,
      is_elective: data.is_elective,
      is_postgraduate: data.is_postgraduate,
      is_public: data.is_public,
      updated_at: data.updated_at,
    },
  });
}

export function deleteCourse(id: Course["id"]) {
  return prisma.course.delete({
    where: { id },
  });
}
