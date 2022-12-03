import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import { links as BoxLinks } from "~/components/Box";
import RegisterToCourseButton from "~/components/buttons/RegisterToCourseButton";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/courses/CoursesList";
import AppLayout from "~/components/layout/AppLayout";
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
import { getStudentFromUserId } from "~/DAO/studentDAO.server";
import { getStudiesCurriculum } from "~/DAO/studiesCurriculumDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/index.css";
import { logout, requireUser } from "~/utils/session.server";
import { getCurrentRegistration } from "~/utils/utils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...ContainerLinks(), ...BoxLinks()];
};

export type LoaderDataT = {
  announcements: Awaited<
    ReturnType<
      | typeof getAnnouncements
      | typeof getAnnouncementsFollowedAsProfessor
      | typeof getAnnouncementsFollowedAsStudent
    >
  >;
  coursesRegistered: Awaited<ReturnType<typeof getCoursesLecturing | typeof getCoursesEnrolled>>;
  canStudentRegister: boolean;
  userInfo: {
    username: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["username"];
    role: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
    fullname: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["fullname"] | null;
    gender: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["gender"] | null;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let coursesRegistered;
  let announcements;
  let canStudentRegister = false;
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
      const student = await getStudentFromUserId(user.id);
      if (!student) throw new Error();

      announcements = await getAnnouncementsFollowedAsStudent(student.id);
      coursesRegistered = await getCoursesEnrolled(student.id);

      if (student.studies_status !== "ALUM") {
        const dateNow = new Date();
        const studiesCurriculum = await getStudiesCurriculum(user.dep_id);
        const { isFallRegistration, isSpringRegistration } = getCurrentRegistration(
          studiesCurriculum,
          dateNow,
        );
        canStudentRegister = isFallRegistration || isSpringRegistration;
      }

      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const profile = await getProfile(user.id);

  return json({
    announcements,
    coursesRegistered,
    canStudentRegister,
    userInfo: {
      username: user.username,
      role: user.role,
      fullname: profile?.fullname,
      gender: profile?.gender,
    },
  });
};

export default function Index() {
  const { announcements, coursesRegistered, canStudentRegister, userInfo } =
    useLoaderData() as LoaderDataT;
  const isPriviledged =
    userInfo.role === USER_ROLE.REGISTRAR || userInfo.role === USER_ROLE.SUPERADMIN;
  const isStudent = userInfo.role === USER_ROLE.STUDENT;
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
          {!isPriviledged && (
            <Container
              title="My courses"
              data={coursesRegistered}
              noResultsMsg={"No courses found"}
              maxItems={6}
              footerLink={{
                directTo: "/my-courses",
              }}
              Button={isStudent && canStudentRegister ? <RegisterToCourseButton /> : undefined}
            >
              <CoursesList />
            </Container>
          )}
        </>
      </Page>
    </AppLayout>
  );
}
