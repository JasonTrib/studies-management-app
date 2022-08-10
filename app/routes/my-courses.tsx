import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { links as ContainerLinks } from "~/components/Container";
import MyCoursesTable from "~/components/courses/MyCoursesTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getCoursesLecturing, getCoursesEnrolled } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import { logout, requireUser } from "~/utils/session.server";

type LoaderData = {
  coursesRegistered: CourseModelT[];
  userRole: UserModelT["role"];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  let coursesRegistered;
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
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return json({ coursesRegistered, userRole: user.role });
};

const MyCoursesPage = () => {
  const { coursesRegistered, userRole } = useLoaderData() as LoaderData;

  let noResults;
  switch (userRole) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      noResults = `No courses can exist for "${userRole}" user.`;
      break;
    case USER_ROLE.PROFESSOR:
      noResults = "No courses found that you are lecturing.";
      break;
    case USER_ROLE.STUDENT:
      noResults = "No courses found that you are enrolled in.";
      break;
  }

  return (
    <AppLayout wide>
      <Table data={coursesRegistered} noResults={noResults} userRole={userRole}>
        <MyCoursesTable />
      </Table>
    </AppLayout>
  );
};

export default MyCoursesPage;
