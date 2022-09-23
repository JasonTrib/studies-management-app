import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import RegistrarsTable from "~/components/users/RegistrarsTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getRegistrarUsersExtended } from "~/DAO/composites/composites.server";
import { logout, requireUser } from "~/utils/session.server";
import { bc_users_regs } from "~/utils/breadcrumbs";

export const links: LinksFunction = () => {
  return [...TableLinks()];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_regs>>;
  registrarUsers: Awaited<ReturnType<typeof getRegistrarUsersExtended>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_regs(path);
  const registrarUsers = await getRegistrarUsersExtended(user.dep_id, user.id);

  return json({ breadcrumbData, registrarUsers });
};

const RegistrarIndexPage = () => {
  const { breadcrumbData, registrarUsers } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <Table data={registrarUsers} noResultsMsg={"No registrars found."}>
        <RegistrarsTable />
      </Table>
    </AppLayout>
  );
};

export default RegistrarIndexPage;
