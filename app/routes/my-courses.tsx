import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { links as ContainerLinks } from "~/components/Container";
import MyCoursesTable from "~/components/courses/MyCoursesTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getCoursesEnrolled, getCoursesLecturing } from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_mycourses } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_mycourses>>;
  coursesRegistered: Exclude<
    Awaited<ReturnType<typeof getCoursesLecturing | typeof getCoursesEnrolled>>,
    null
  >;
  userRole: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["role"];
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
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_mycourses(path);

  return json({ breadcrumbData, coursesRegistered, userRole: user.role });
};

const MyCoursesPage = () => {
  const { breadcrumbData, coursesRegistered, userRole } = useLoaderData() as LoaderDataT;

  let noResultsMsg;
  switch (userRole) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      noResultsMsg = `No courses can exist for "${userRole}" user.`;
      break;
    case USER_ROLE.PROFESSOR:
      noResultsMsg = "No courses found that you are lecturing.";
      break;
    case USER_ROLE.STUDENT:
      noResultsMsg = "No courses found that you are enrolled in.";
      break;
  }

  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <Table data={coursesRegistered} noResultsMsg={noResultsMsg} userRole={userRole}>
        <MyCoursesTable />
      </Table>
    </AppLayout>
  );
};

export default MyCoursesPage;
