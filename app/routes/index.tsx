import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsListContainer, {
  links as AnnouncementsListContainerLinks,
} from "~/components/AnnouncementsListContainer";
import AppLayout from "~/components/AppLayout";
import Box, { links as BoxLinks } from "~/components/Box";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesListContainer, {
  links as CoursesListContainerLinks,
} from "~/components/CoursesListContainer";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnouncementsFollowed } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";
import { getStudentCourses } from "~/DAO/studentCourseDAO.server";
import type { StudentCourseT } from "~/DAO/studentDAO.server";

export type LoaderData = {
  announcements: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  announcementsFollowed: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  courses: CourseModelT[];
  studentCourses: (StudentCourseT & {
    course: CourseModelT;
  })[];
};

export const links: LinksFunction = () => {
  return [
    ...AnnouncementsListContainerLinks(),
    ...CoursesListContainerLinks(),
    ...ContainerLinks(),
    ...BoxLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();
  const studentCourses = await getStudentCourses(2);
  const { coursesFollowed, announcements } = await getAnnouncementsFollowed(2);

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
          <AnnouncementsListContainer title="My announcements" data={announcementsFollowed} />
          <Container items={6} maxItems={3} />
          <Container />
          <CoursesListContainer data={courses} />
        </>
        <>
          <Box height={250} />
          <CoursesListContainer title="My courses" data={studentCourses.map((x) => x.course)} />
          <AnnouncementsListContainer title="Announcements" data={announcements} />
        </>
      </AppLayout>
    </div>
  );
}
