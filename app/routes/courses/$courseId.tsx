import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box from "~/components/Box";
import Container from "~/components/Container";
import Course, { links as CourseLinks } from "~/components/courses/Course";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsOnFollowedCourse,
  getCourseExtended,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  course: CourseModelT & {
    students_registered: number;
    students_following: number;
    professors: {
      id: number;
      name: string;
      surname: string;
    }[];
  };
  announcements: AnnouncementModelT &
    {
      course: {
        title: string;
      };
    }[];
  isFollowingCourse: boolean;
};

export const links: LinksFunction = () => {
  return [...CourseLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const studentId = 1;

  const announcements = await getAnnouncementsOnFollowedCourse(studentId, courseId);
  const isFollowingCourse = await getIsStudentFollowingCourse(studentId, courseId);
  const course = await getCourseExtended(courseId);

  if (!course) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ course, announcements, isFollowingCourse });
};

const CourseDetailsPage = () => {
  const { course, announcements, isFollowingCourse } = useLoaderData() as LoaderData;

  course.description =
    "Database management courses introduce students to languages, applications and programming used for the" +
    "design and maintenance of business databases. One of the basic skills covered in database management courses" +
    "is the use of Structured Query Language (SQL), the most common database manipulation language.";

  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          <Link to={`/my-courses`}>My courses</Link>
        </div>
        <Course data={course} />
      </>
      <>
        {isFollowingCourse ? (
          <Container
            title={`Course announcements`}
            data={announcements}
            noResults={"No announcements found"}
          >
            <AnnouncementsList />
          </Container>
        ) : (
          <Container title={`Follow course to view announcements ⬇`} />
        )}
      </>
      <Box height={250} />
    </AppLayout>
  );
};

export default CourseDetailsPage;
