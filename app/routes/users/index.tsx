import type { LoaderFunction } from "@remix-run/node";
import AppLayout from "~/components/AppLayout";
import { logout, requireUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  return null;
};

const UsersIndexPage = () => {
  return (
    <AppLayout wide>
      <>
        Registrars
        <br />
        Profs
        <br />
        Students
      </>
    </AppLayout>
  );
};

export default UsersIndexPage;
