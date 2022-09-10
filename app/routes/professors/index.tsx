import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import ProfessorsTable from "~/components/ProfessorsTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getProfessorUsersExtended } from "~/DAO/composites/composites.server";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  professorUsers: Awaited<ReturnType<typeof getProfessorUsersExtended>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const professorUsers = await getProfessorUsersExtended(user.dep_id, user.id);

  return json({ professorUsers });
};

const ProfessorsIndexPage = () => {
  const { professorUsers } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout wide>
      <Table data={professorUsers} noResultsMsg={"No professors found."}>
        <ProfessorsTable />
      </Table>
    </AppLayout>
  );
};

export default ProfessorsIndexPage;
