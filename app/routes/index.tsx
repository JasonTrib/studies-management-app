import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box, { links as BoxLinks } from "~/components/Box";
import RegisterToCourseButton from "~/components/buttons/RegisterToCourseButton";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/courses/CoursesList";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnouncementsFollowed, getCoursesRegistered } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/index.css";

export type LoaderData = {
  announcementsFollowed: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  coursesRegistered: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...ContainerLinks(), ...BoxLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const studentID = 2;

  const announcementsFollowed = await getAnnouncementsFollowed(studentID);
  const coursesRegistered = await getCoursesRegistered(studentID);

  return json({ announcementsFollowed, coursesRegistered });
};

export default function Index() {
  const { announcementsFollowed, coursesRegistered } = useLoaderData() as LoaderData;

  return (
    <div>
      <AppLayout>
        <>
          <Container
            title="My announcements"
            data={announcementsFollowed}
            noResults={"No announcements found"}
          >
            <AnnouncementsList />
          </Container>
        </>
        <>
          <Box height={250} />
          <Container
            title="My courses"
            data={coursesRegistered}
            noResults={"No courses found"}
            maxItems={6}
            moreLink={"/my-courses"}
            Button={<RegisterToCourseButton />}
          >
            <CoursesList />
          </Container>
        </>
      </AppLayout>
    </div>
  );
}
