import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import Container, { links as ContainerLinks } from "~/components/Container";
import Page from "~/components/layout/Page";
import { getAnnouncements } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsFollowedAsProfessor,
  getAnnouncementsFollowedAsStudent,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_anns } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_anns>>;
  announcements: Awaited<
    ReturnType<
      | typeof getAnnouncements
      | typeof getAnnouncementsFollowedAsProfessor
      | typeof getAnnouncementsFollowedAsStudent
    >
  >;
};

export const links: LinksFunction = () => {
  return [...ContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let announcements;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      announcements = await getAnnouncements(user.dep_id);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      announcements = await getAnnouncementsFollowedAsProfessor(prof.id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      announcements = await getAnnouncementsFollowedAsStudent(student.id);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_anns(path);

  return { breadcrumbData, announcements };
};

const AnnouncementsIndexPage = () => {
  const { breadcrumbData, announcements } = useLoaderData() as LoaderDataT;

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <Container data={announcements}>
        <AnnouncementsList />
      </Container>
    </Page>
  );
};

export default AnnouncementsIndexPage;
