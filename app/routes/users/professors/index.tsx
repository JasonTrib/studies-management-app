import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewButton from "~/components/buttons/NewButton";
import Page from "~/components/layout/Page";
import Table, { links as TableLinks } from "~/components/Table";
import ProfessorsTable from "~/components/users/ProfessorsTable";
import { getProfessorUsersExtended } from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_users_profs } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_profs>>;
  professorUsers: Awaited<ReturnType<typeof getProfessorUsersExtended>>;
  userRole: UserModelT["role"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_profs(path);
  const professorUsers = await getProfessorUsersExtended(user.dep_id, user.id);

  return json({ breadcrumbData, professorUsers, userRole: user.role });
};

const ProfessorsIndexPage = () => {
  const { breadcrumbData, professorUsers, userRole } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;

  const headingActions = (): JSX.Element | null => {
    return isPriviledged ? <NewButton directTo={"/users/professors/new"} /> : null;
  };

  return (
    <Page wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <Table data={professorUsers} noResultsMsg={"No professors found."}>
        <ProfessorsTable />
      </Table>
    </Page>
  );
};

export default ProfessorsIndexPage;
