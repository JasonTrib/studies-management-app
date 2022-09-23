import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import NewAnnouncementButton from "~/components/buttons/NewAnnouncementButton";
import Container from "~/components/Container";
import { links as CourseLinks } from "~/components/courses/Course";
import { getAnnouncementsOfCourse } from "~/DAO/announcementDAO.server";
import { getIsProfessorLecturingCourse } from "~/DAO/composites/composites.server";
import { getProfessorCourseFollowing } from "~/DAO/professorCourseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentCourseFollowing } from "~/DAO/studentCourseDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import modalStyles from "~/styles/modal.css";
import { bc_courses_id_anns } from "~/utils/breadcrumbs";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: modalStyles }, ...CourseLinks()];
};

export type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_anns>>;
  announcements: Awaited<ReturnType<typeof getAnnouncementsOfCourse>>;
  canModAnns: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  let announcements;
  let canModAnns = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canModAnns = true;
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      const profCourse = await getProfessorCourseFollowing(prof.id, courseId);
      if (!profCourse) return redirect(`/courses/${courseId}`);

      canModAnns = await getIsProfessorLecturingCourse(prof.id, courseId);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      const studentCourse = await getStudentCourseFollowing(student.id, courseId);
      if (!studentCourse) return redirect(`/courses/${courseId}`);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  announcements = await getAnnouncementsOfCourse(courseId);
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_anns(path);

  return json({ breadcrumbData, announcements, canModAnns });
};

const CourseAnnouncementsIndexPage = () => {
  const { breadcrumbData, announcements, canModAnns } = useLoaderData() as LoaderDataT;
  const { courseId: courseIdRaw } = useParams();
  const courseId = parseInt(courseIdRaw || "");

  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <Container
        title="Announcements"
        data={announcements}
        noResultsMsg="No announcements"
        Button={canModAnns ? <NewAnnouncementButton courseId={courseId} /> : <></>}
      >
        <AnnouncementsList
          untrimmed
          deletable={canModAnns}
          landingRoute={`/courses/${courseId}/announcements`}
        />
      </Container>
    </AppLayout>
  );
};

export default CourseAnnouncementsIndexPage;
