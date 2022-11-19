import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import RegisterToCourseButton from "~/components/buttons/RegisterToCourseButton";
import { links as ContainerLinks } from "~/components/Container";
import MyCoursesTable from "~/components/courses/MyCoursesTable";
import AppLayout from "~/components/layout/AppLayout";
import Page from "~/components/layout/Page";
import Table, { links as TableLinks } from "~/components/Table";
import { getCoursesEnrolled, getCoursesLecturing } from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getProfile } from "~/DAO/profileDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { getStudiesCurriculum } from "~/DAO/studiesCurriculumDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_mycourses } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import { getCurrentRegistration } from "~/utils/utils";

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_mycourses>>;
  coursesRegistered: Exclude<
    Awaited<ReturnType<typeof getCoursesLecturing | typeof getCoursesEnrolled>>,
    null
  >;
  canRegisterToCourse: boolean;
  userInfo: {
    username: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["username"];
    role: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
    fullname: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["fullname"] | null;
    gender: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["gender"] | null;
  };
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let coursesRegistered;
  let canRegisterToCourse;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();
      coursesRegistered = await getCoursesLecturing(prof.id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();
      coursesRegistered = await getCoursesEnrolled(student.id);

      const dateNow = new Date();
      const studiesCurriculum = await getStudiesCurriculum(user.dep_id);
      const { isFallRegistration, isSpringRegistration } = getCurrentRegistration(
        studiesCurriculum,
        dateNow,
      );
      canRegisterToCourse = isFallRegistration || isSpringRegistration;
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const profile = await getProfile(user.id);
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_mycourses(path);

  return json({
    breadcrumbData,
    coursesRegistered,
    canRegisterToCourse,
    userInfo: {
      username: user.username,
      role: user.role,
      fullname: profile?.fullname,
      gender: profile?.gender,
    },
  });
};

const MyCoursesPage = () => {
  const { breadcrumbData, coursesRegistered, canRegisterToCourse, userInfo } =
    useLoaderData() as LoaderDataT;

  let noResultsMsg;
  switch (userInfo.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      noResultsMsg = `No courses can exist for "${userInfo.role}" user.`;
      break;
    case USER_ROLE.PROFESSOR:
      noResultsMsg = "No courses found that you are lecturing.";
      break;
    case USER_ROLE.STUDENT:
      noResultsMsg = "No courses found that you are enrolled in.";
      break;
  }

  const headingActions = (): JSX.Element | null => {
    return canRegisterToCourse ? <RegisterToCourseButton /> : null;
  };

  return (
    <AppLayout userInfo={userInfo}>
      <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
        <Table data={coursesRegistered} noResultsMsg={noResultsMsg} userRole={userInfo.role}>
          <MyCoursesTable showHasPassed />
        </Table>
      </Page>
    </AppLayout>
  );
};

export default MyCoursesPage;
