import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import NewButton from "~/components/buttons/NewButton";
import Table, { links as TableLinks } from "~/components/Table";
import RegistrarsTable from "~/components/users/RegistrarsTable";
import { getRegistrarUsersExtended } from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import { bc_users_regs } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_regs>>;
  registrarUsers: Awaited<ReturnType<typeof getRegistrarUsersExtended>>;
  userRole: UserModelT["role"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_regs(path);
  const registrarUsers = await getRegistrarUsersExtended(user.dep_id, user.id);

  return json({ breadcrumbData, registrarUsers, userRole: user.role });
};

const RegistrarIndexPage = () => {
  const { breadcrumbData, registrarUsers, userRole } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.SUPERADMIN;

  const headingActions = (): JSX.Element | null => {
    return isPriviledged ? <NewButton directTo={"/users/registrars/new"} /> : null;
  };

  return (
    <AppLayout wide breadcrumbs={breadcrumbData} Actions={headingActions()}>
      <Table data={registrarUsers} noResultsMsg={"No registrars found."}>
        <RegistrarsTable />
      </Table>
    </AppLayout>
  );
};

export default RegistrarIndexPage;
