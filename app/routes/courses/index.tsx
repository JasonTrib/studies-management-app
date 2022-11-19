import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewButton from "~/components/buttons/NewButton";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesTable from "~/components/courses/CoursesTable";
import Page from "~/components/layout/Page";
import Table, { links as TableLinks } from "~/components/Table";
import {
  getCoursesAsProfessorExtended,
  getCoursesAsStudentExtended,
  getCoursesExtended,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_courses } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

type CoursesExtededT = Awaited<
  ReturnType<
    | typeof getCoursesExtended
    | typeof getCoursesAsProfessorExtended
    | typeof getCoursesAsStudentExtended
  >
>;

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses>>;
  courses: {
    undergrad: CoursesExtededT;
    postgrad: CoursesExtededT;
  };
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let coursesExtended;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      coursesExtended = await getCoursesExtended(user.dep_id);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();
      coursesExtended = await getCoursesAsProfessorExtended(user.dep_id, prof.id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();
      coursesExtended = await getCoursesAsStudentExtended(user.dep_id, student.id);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  type CoursesExtendedT = typeof coursesExtended;
  const courses = coursesExtended.reduce(
    (prev: { undergrad: CoursesExtendedT; postgrad: CoursesExtendedT }, curr) => {
      if (curr.is_postgraduate) {
        return { ...prev, postgrad: [...prev.postgrad, curr] };
      }
      return { ...prev, undergrad: [...prev.undergrad, curr] };
    },
    { undergrad: [], postgrad: [] },
  );

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses(path);

  return json({ breadcrumbData, courses, userRole: user.role });
};

const CourseIndexPage = () => {
  const { breadcrumbData, courses, userRole } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;
  const undergradsExist = courses.undergrad.length > 0;
  const postgradsExist = courses.postgrad.length > 0;

  const headingActions = (): JSX.Element | null => {
    return isPriviledged ? <NewButton directTo={"/courses/new"} /> : null;
  };

  return (
    <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <>
        {undergradsExist || postgradsExist ? (
          <>
            {undergradsExist && (
              <Table data={courses.undergrad} userRole={userRole}>
                <CoursesTable showHasPassed />
              </Table>
            )}
            {postgradsExist && (
              <Table data={courses.postgrad} userRole={userRole}>
                <CoursesTable showHasPassed isPostgraduate />
              </Table>
            )}
          </>
        ) : (
          <Container title={"No courses found"} />
        )}
      </>
    </Page>
  );
};

export default CourseIndexPage;
