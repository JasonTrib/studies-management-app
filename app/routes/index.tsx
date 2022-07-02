import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box, { links as BoxLinks } from "~/components/Box";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/CoursesList";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnouncementsFollowed } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";
import { getStudentCourses } from "~/DAO/studentCourseDAO.server";

export type LoaderData = {
  announcements: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  announcementsFollowed: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  courses: CourseModelT[];
  studentCourses: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...BoxLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();
  const studentCoursesRaw = await getStudentCourses(2);
  const { coursesFollowed, announcements } = await getAnnouncementsFollowed(2);

  const studentCourses = studentCoursesRaw.map((x) => x.course);

  const announcementsFollowed = coursesFollowed.flatMap((course) =>
    announcements.filter((ann) => ann.course_id === course.course_id),
  );

  return json({ announcements, courses, announcementsFollowed, studentCourses });
};

export default function Index() {
  const { announcements, courses, announcementsFollowed, studentCourses } =
    useLoaderData() as LoaderData;

  return (
    <div>
      <AppLayout>
        <>
          <Container title="My announcements" data={announcementsFollowed}>
            <AnnouncementsList />
          </Container>
          <Container title="Announcements" data={announcements}>
            <AnnouncementsList />
          </Container>
        </>
        <>
          <Box height={250} />
          <Container title="My courses" data={studentCourses}>
            <CoursesList />
          </Container>
          <Container title="Courses" data={courses}>
            <CoursesList />
          </Container>
        </>
      </AppLayout>
    </div>
  );
}
