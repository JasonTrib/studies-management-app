import type { User } from "@prisma/client";
import { getAllAnnoucements } from "../announcementDAO.server";
import { getStudentCoursesFollowed } from "../studentCourseDAO.server";

export async function getAnnouncementsFollowed(userId: User["id"]) {
  const coursesFollowed = await getStudentCoursesFollowed(userId);
  const announcements = await getAllAnnoucements();

  return { coursesFollowed, announcements };
}
