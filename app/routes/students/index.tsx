import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import StudentsTable from "~/components/StudentsTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getStudentUsersExtended } from "~/DAO/composites/composites.server";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  studentUsers: Awaited<ReturnType<typeof getStudentUsersExtended>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const studentUsers = await getStudentUsersExtended(user.dep_id, user.id);

  return json({ studentUsers });
};

const StudentIndexPage = () => {
  const { studentUsers } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout wide>
      <Table data={studentUsers} noResultsMsg={"No students found."}>
        <StudentsTable />
      </Table>
    </AppLayout>
  );
};

export default StudentIndexPage;
