import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import ProfessorsTable from "~/components/users/ProfessorsTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getProfessorUsersExtended } from "~/DAO/composites/composites.server";
import { logout, requireUser } from "~/utils/session.server";
import { bc_users_profs } from "~/utils/breadcrumbs";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_profs>>;
  professorUsers: Awaited<ReturnType<typeof getProfessorUsersExtended>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_profs(path);
  const professorUsers = await getProfessorUsersExtended(user.dep_id, user.id);

  return json({ breadcrumbData, professorUsers });
};

const ProfessorsIndexPage = () => {
  const { breadcrumbData, professorUsers } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <Table data={professorUsers} noResultsMsg={"No professors found."}>
        <ProfessorsTable />
      </Table>
    </AppLayout>
  );
};

export default ProfessorsIndexPage;
