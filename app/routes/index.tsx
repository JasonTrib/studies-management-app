import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box, { links as BoxLinks } from "~/components/Box";
import RegisterToCourseButton from "~/components/buttons/RegisterToCourseButton";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/courses/CoursesList";
import { getAnnoucements } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsFollowedAsProfessor,
  getAnnouncementsFollowedAsStudent,
  getCoursesEnrolled,
  getCoursesLecturing,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/index.css";
import { logout, requireUser } from "~/utils/session.server";

export type LoaderDataT = {
  announcements: Awaited<
    ReturnType<
      | typeof getAnnoucements
      | typeof getAnnouncementsFollowedAsProfessor
      | typeof getAnnouncementsFollowedAsStudent
    >
  >;
  coursesRegistered: Awaited<ReturnType<typeof getCoursesLecturing | typeof getCoursesEnrolled>>;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...ContainerLinks(), ...BoxLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let coursesRegistered;
  let announcements;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      announcements = await getAnnoucements(user.dep_id);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      announcements = await getAnnouncementsFollowedAsProfessor(prof.id);
      coursesRegistered = await getCoursesLecturing(prof.id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      announcements = await getAnnouncementsFollowedAsStudent(student.id);
      coursesRegistered = await getCoursesEnrolled(student.id);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return json({ announcements, coursesRegistered, userRole: user.role });
};

export default function Index() {
  const { announcements, coursesRegistered, userRole } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;
  const isStudent = userRole === USER_ROLE.STUDENT;
  const annTitle = isPriviledged ? "Announcements" : "My announcements";

  return (
    <AppLayout>
      <>
        <Container
          title={annTitle}
          data={announcements}
          noResultsMsg={"No announcements found"}
          maxItems={8}
          footerLink={{
            directTo: "/announcements",
          }}
        >
          <AnnouncementsList />
        </Container>
      </>
      <>
        <Box height={250} />
        {!isPriviledged && (
          <Container
            title="My courses"
            data={coursesRegistered}
            noResultsMsg={"No courses found"}
            maxItems={6}
            footerLink={{
              directTo: "/my-courses",
            }}
            Button={isStudent ? <RegisterToCourseButton /> : undefined}
          >
            <CoursesList />
          </Container>
        )}
      </>
    </AppLayout>
  );
}
