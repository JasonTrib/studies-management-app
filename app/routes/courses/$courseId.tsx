import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box from "~/components/Box";
import NewAnnouncementButton from "~/components/buttons/NewAnnouncementButton";
import Container from "~/components/Container";
import Course, { links as CourseLinks } from "~/components/courses/Course";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnoucementsOfCourse } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsOnProfessorFollowedCourse,
  getAnnouncementsOnStudentFollowedCourse,
  getCourseExtended,
  getIsProfessorFollowingCourse,
  getIsProfessorLecturingCourse,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

type LoaderData = {
  course: CourseModelT & {
    students_registered: number;
    students_following: number;
    professors: {
      id: number;
      fullname: string;
    }[];
  };
  announcements: AnnouncementModelT &
    {
      course: {
        title: string;
      };
    }[];
  isFollowingCourse: boolean;
  canCreateAnn: boolean;
  canEditCourse: boolean;
};

export const links: LinksFunction = () => {
  return [...CourseLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  let course = await getCourseExtended(courseId);
  if (!course) {
    throw new Response("Not Found", { status: 404 });
  }

  let announcements;
  let canCreateAnn = false;
  let canEditCourse = false;
  let isFollowingCourse = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canEditCourse = true;
      canCreateAnn = true;
      isFollowingCourse = true;
      announcements = await getAnnoucementsOfCourse(courseId);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      canCreateAnn = await getIsProfessorLecturingCourse(prof.id, courseId);
      if (canCreateAnn) {
        isFollowingCourse = true;
      } else {
        isFollowingCourse = await getIsProfessorFollowingCourse(prof.id, courseId);
      }
      if (isFollowingCourse) {
        announcements = await getAnnouncementsOnProfessorFollowedCourse(prof.id, courseId);
      }
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      isFollowingCourse = await getIsStudentFollowingCourse(student.id, courseId);
      if (isFollowingCourse) {
        announcements = await getAnnouncementsOnStudentFollowedCourse(student.id, courseId);
      }
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return json({ course, announcements, isFollowingCourse, canEditCourse, canCreateAnn });
};

const CourseDetailsPage = () => {
  const { course, announcements, isFollowingCourse, canEditCourse, canCreateAnn } =
    useLoaderData() as LoaderData;

  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          <Link to={`/my-courses`}>My courses</Link>
        </div>
        <Course data={course} canEdit={canEditCourse} />
      </>
      <>
        {isFollowingCourse ? (
          <Container
            title={`Course announcements`}
            data={announcements}
            noResults={"No announcements found"}
            Button={canCreateAnn ? <NewAnnouncementButton courseId={course.id} /> : undefined}
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
