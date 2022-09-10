import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { links as ContainerLinks } from "~/components/Container";
import CoursesTable from "~/components/courses/CoursesTable";
import Table, { links as TableLinks } from "~/components/Table";
import {
  getCoursesAsProfessorExtended,
  getCoursesAsStudentExtended,
  getCoursesExtended,
} from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  courses: Awaited<
    ReturnType<
      | typeof getCoursesExtended
      | typeof getCoursesAsProfessorExtended
      | typeof getCoursesAsStudentExtended
    >
  >;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let courses;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      courses = await getCoursesExtended(user.dep_id);
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();
      courses = await getCoursesAsProfessorExtended(user.dep_id, prof.id);
      break;
    case USER_ROLE.STUDENT:
      const student = await getStudentId(user.id);
      if (!student) throw new Error();
      courses = await getCoursesAsStudentExtended(user.dep_id, student.id);
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return json({ courses, userRole: user.role });
};

const CourseIndexPage = () => {
  const { courses, userRole } = useLoaderData() as LoaderDataT;

  return (
    <AppLayout wide>
      <Table data={courses} noResultsMsg={"No courses found."} userRole={userRole}>
        <CoursesTable />
      </Table>
    </AppLayout>
  );
};

export default CourseIndexPage;
