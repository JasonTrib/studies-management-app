import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Box from "~/components/Box";
import FollowCourseButton from "~/components/buttons/FollowCourseButton";
import NewAnnouncementButton from "~/components/buttons/NewAnnouncementButton";
import Container from "~/components/Container";
import Course, { links as CourseLinks } from "~/components/courses/Course";
import { getAnnoucementsOfCourse } from "~/DAO/announcementDAO.server";
import {
  getAnnouncementsOnProfessorFollowedCourse,
  getAnnouncementsOnStudentFollowedCourse,
  getCourseExtended,
  getIsProfessorFollowingCourse,
  getIsProfessorLecturingCourse,
  getIsStudentFollowingCourse,
} from "~/DAO/composites/composites.server";
import { followProfessorCourse, unfollowProfessorCourse } from "~/DAO/professorCourseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { followStudentCourse, unfollowStudentCourse } from "~/DAO/studentCourseDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import modalStyles from "~/styles/modal.css";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: modalStyles }, ...CourseLinks()];
};
type LoaderDataT = {
  course: Exclude<Awaited<ReturnType<typeof getCourseExtended>>, null>;
  announcements: Awaited<
    ReturnType<
      | typeof getAnnoucementsOfCourse
      | typeof getAnnouncementsOnProfessorFollowedCourse
      | typeof getAnnouncementsOnStudentFollowedCourse
    >
  >;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
  isFollowingCourse: boolean;
  canModAnns: boolean;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const courseIdRaw = formData.get("courseId");

  const courseId = paramToInt(`${courseIdRaw}`);
  if (!courseId) throw new Error();

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      if (action === "follow") await followProfessorCourse(prof.id, courseId);
      if (action === "unfollow") await unfollowProfessorCourse(prof.id, courseId);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();

      if (action === "follow") await followStudentCourse(student.id, courseId);
      if (action === "unfollow") await unfollowStudentCourse(student.id, courseId);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return null;
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
  let canModAnns = false;
  let isFollowingCourse = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canModAnns = true;
      isFollowingCourse = true;
      announcements = await getAnnoucementsOfCourse(courseId);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      canModAnns = await getIsProfessorLecturingCourse(prof.id, courseId);
      if (canModAnns) {
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

  return json({
    course,
    announcements,
    isFollowingCourse,
    userRole: user.role,
    canModAnns,
  });
};

const CourseDetailsPage = () => {
  const { course, announcements, isFollowingCourse, userRole, canModAnns } =
    useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;

  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          {isPriviledged ? (
            <Link to={`/courses`}>Courses</Link>
          ) : (
            <Link to={`/my-courses`}>My courses</Link>
          )}
        </div>
        <Course data={course} canEdit={isPriviledged} />
      </>
      <>
        {isFollowingCourse ? (
          <Container
            title={`Course announcements`}
            data={announcements}
            noResults={"No announcements found"}
            Button={
              canModAnns ? (
                <NewAnnouncementButton courseId={course.id} />
              ) : (
                <FollowCourseButton variant="unfollow" courseId={course.id} />
              )
            }
          >
            <AnnouncementsList deletable={canModAnns} landingRoute={`/courses/${course.id}`} />
          </Container>
        ) : (
          <Container
            title={`Follow to view announcements`}
            Button={<FollowCourseButton variant="follow" courseId={course.id} />}
          />
        )}
      </>
      <Box height={250} />
    </AppLayout>
  );
};

export default CourseDetailsPage;
