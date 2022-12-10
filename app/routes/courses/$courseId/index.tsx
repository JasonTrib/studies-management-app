import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useMatches } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import FollowCourseButton from "~/components/buttons/FollowCourseButton";
import GradeCourseButton from "~/components/buttons/GradeCourseButton";
import Container from "~/components/Container";
import Course, { links as CourseLinks } from "~/components/courses/Course";
import CogIcon from "~/components/icons/CogIcon";
import Page from "~/components/layout/Page";
import { getAnnouncementsOfCourse } from "~/DAO/announcementDAO.server";
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
import { bc_courses_id } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import { getIsCourseGradingOpen, paramToInt } from "~/utils/utils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: modalStyles }, ...CourseLinks()];
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const courseId = paramToInt(params.courseId);
  if (courseId === null) throw new Response("Not Found", { status: 404 });

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

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id>>;
  course: Exclude<Awaited<ReturnType<typeof getCourseExtended>>, null>;
  announcements: Awaited<
    ReturnType<
      | typeof getAnnouncementsOfCourse
      | typeof getAnnouncementsOnProfessorFollowedCourse
      | typeof getAnnouncementsOnStudentFollowedCourse
    >
  >;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
  isFollowingCourse: boolean;
  canModAnns: boolean;
  canGradeCourse: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);

  let course = await getCourseExtended(courseId);
  if (!course) throw new Response("Not Found", { status: 404 });

  let announcements;
  let canModAnns = false;
  let isFollowingCourse = false;
  let canGradeCourse = false;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      canModAnns = true;
      isFollowingCourse = true;
      canGradeCourse = getIsCourseGradingOpen(course.semester, new Date());
      announcements = await getAnnouncementsOfCourse(courseId);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      const isLecturing = await getIsProfessorLecturingCourse(prof.id, courseId);
      if (isLecturing) {
        canModAnns = true;
        isFollowingCourse = true;
        canGradeCourse = getIsCourseGradingOpen(course.semester, new Date());
      } else {
        canModAnns = false;
        canGradeCourse = false;
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
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id(path);

  return {
    breadcrumbData,
    course,
    announcements,
    isFollowingCourse,
    userRole: user.role,
    canModAnns,
    canGradeCourse,
  };
};

const CourseDetailsPage = () => {
  const {
    breadcrumbData,
    course,
    announcements,
    isFollowingCourse,
    userRole,
    canModAnns,
    canGradeCourse,
  } = useLoaderData() as LoaderDataT;
  const matches = useMatches();
  const courseId = paramToInt(matches[0].params["courseId"]);
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;

  const headingActions = (): JSX.Element | null => {
    return (
      <>
        {canGradeCourse && courseId !== null && <GradeCourseButton courseId={courseId} />}
        {isPriviledged && (
          <span className="svg-link">
            <Link to={`edit`}>
              <CogIcon />
            </Link>
          </span>
        )}
      </>
    );
  };

  return (
    <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <>
        <Course data={course} canEdit={isPriviledged} />
      </>
      <>
        {isFollowingCourse ? (
          <Container
            title={`Course announcements`}
            data={announcements}
            noResultsMsg={"No announcements found"}
            maxItems={6}
            footerLink={{
              text: "View all...",
              directTo: `/courses/${course.id}/announcements`,
              fixed: true,
            }}
            Button={
              canModAnns ? undefined : (
                <FollowCourseButton variant="unfollow" courseId={course.id} />
              )
            }
          >
            <AnnouncementsList />
          </Container>
        ) : (
          <Container
            title={`Follow to view announcements`}
            Button={<FollowCourseButton variant="follow" courseId={course.id} />}
          />
        )}
      </>
    </Page>
  );
};

export default CourseDetailsPage;
