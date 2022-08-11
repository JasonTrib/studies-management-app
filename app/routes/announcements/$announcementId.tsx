import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Announcement, { links as AnnouncementLinks } from "~/components/announcements/Announcement";
import AppLayout from "~/components/AppLayout";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnoucement } from "~/DAO/announcementDAO.server";
import {
  getIsProfessorFollowingCourse,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

type LoaderData = {
  announcement: AnnouncementModelT & {
    course: CourseModelT;
  };
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.announcementId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const announcement = await getAnnoucement(id);
  if (!announcement) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  let isFollowing: boolean;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      isFollowing = await getIsProfessorFollowingCourse(prof.id, announcement.course_id);
      if (!isFollowing) {
        throw new Response("Unauthorized", { status: 401 });
      }
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      isFollowing = await getIsStudentFollowingCourse(student.id, announcement.course_id);
      if (!isFollowing) {
        throw new Response("Unauthorized", { status: 401 });
      }
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return json({ announcement });
};

const AnnouncementDetailsPage = () => {
  const { announcement } = useLoaderData() as LoaderData;
  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          <Link to={`/courses/${announcement.course.id}`}>{announcement.course.title}</Link>
        </div>
        <Announcement data={announcement} />
      </>
    </AppLayout>
  );
};

export default AnnouncementDetailsPage;
