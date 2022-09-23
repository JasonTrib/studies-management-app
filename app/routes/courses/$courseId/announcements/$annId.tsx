import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Announcement, { links as AnnouncementLinks } from "~/components/announcements/Announcement";
import AppLayout from "~/components/AppLayout";
import { getAnnouncement } from "~/DAO/announcementDAO.server";
import {
  getIsProfessorFollowingCourse,
  getIsProfessorLecturingCourse,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_courses_id_anns_id } from "~/utils/breadcrumbs";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_anns_id>>;
  announcement: Exclude<Awaited<ReturnType<typeof getAnnouncement>>, null>;
  canDeleteAnn: boolean;
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const annId = paramToInt(params.annId);
  const courseId = paramToInt(params.courseId);
  if (annId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const announcement = await getAnnouncement(annId);
  if (!announcement || announcement.course_id !== courseId) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  let isFollowing: boolean;
  let canDeleteAnn = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canDeleteAnn = true;
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      isFollowing = await getIsProfessorFollowingCourse(prof.id, announcement.course_id);
      if (!isFollowing) {
        throw new Response("Unauthorized", { status: 401 });
      }
      canDeleteAnn = await getIsProfessorLecturingCourse(prof.id, announcement.course_id);
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
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_anns_id(path);

  return json({ announcement, canDeleteAnn, breadcrumbData });
};

const AnnouncementDetailsPage = () => {
  const { announcement, canDeleteAnn, breadcrumbData } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout breadcrumbs={breadcrumbData} wide>
      <>
        <div className="content-heading link">
          <Link to={`/courses/${announcement.course.id}`}>{announcement.course.title}</Link>
        </div>
        <Announcement data={announcement} showDelete={canDeleteAnn} />
      </>
    </AppLayout>
  );
};

export default AnnouncementDetailsPage;
