import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import Table, { links as TableLinks } from "~/components/Table";
import StudentsTable from "~/components/users/StudentsTable";
import { getStudentUsersExtended } from "~/DAO/composites/composites.server";
import { bc_users_studs } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_studs>>;
  studentUsers: Awaited<ReturnType<typeof getStudentUsersExtended>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_studs(path);
  const studentUsers = await getStudentUsersExtended(user.dep_id, user.id);

  return json({ breadcrumbData, studentUsers });
};

const StudentIndexPage = () => {
  const { breadcrumbData, studentUsers } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <Table data={studentUsers} noResultsMsg={"No students found."}>
        <StudentsTable />
      </Table>
    </AppLayout>
  );
};

export default StudentIndexPage;
