import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box, { links as BoxLinks } from "~/components/Box";
import RegisterToCourseButton from "~/components/buttons/RegisterToCourseButton";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/courses/CoursesList";
import Page from "~/components/layout/Page";
import { getAnnouncements } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsFollowedAsProfessor,
  getAnnouncementsFollowedAsStudent,
  getCoursesEnrolled,
  getCoursesLecturing,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getProfile } from "~/DAO/profileDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/index.css";
import { logout, requireUser } from "~/utils/session.server";

export type LoaderDataT = {
  announcements: Awaited<
    ReturnType<
      | typeof getAnnouncements
      | typeof getAnnouncementsFollowedAsProfessor
      | typeof getAnnouncementsFollowedAsStudent
    >
  >;
  coursesRegistered: Awaited<ReturnType<typeof getCoursesLecturing | typeof getCoursesEnrolled>>;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
  userInfo: {
    username: UserModelT["username"];
    fullname: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["fullname"] | null;
    gender: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["gender"] | null;
  };
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
      announcements = await getAnnouncements(user.dep_id);
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
  const profile = await getProfile(user.id);

  return json({
    announcements,
    coursesRegistered,
    userRole: user.role,
    userInfo: {
      username: user.username,
      fullname: profile?.fullname,
      gender: profile?.gender,
    },
  });
};

export default function Index() {
  const { announcements, coursesRegistered, userRole, userInfo } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;
  const isStudent = userRole === USER_ROLE.STUDENT;
  const annTitle = isPriviledged ? "Announcements" : "My announcements";

  return (
    <AppLayout userInfo={userInfo}>
      <Page title="Home">
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
      </Page>
    </AppLayout>
  );
}
