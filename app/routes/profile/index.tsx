import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataTT = {
  user: Exclude<Awaited<ReturnType<typeof requireUser>>, null>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  return { user };
};

const ProfileIndexPage = () => {
  const { user } = useLoaderData() as LoaderDataTT;

  return (
    <AppLayout>
      <>
        <div>{"ProfileIndexPage"}</div>
        <div>{`id: ${user.id}`}</div>
        <div>{`username: ${user.username}`}</div>
        <div>{`dep: ${user.dep_id}`}</div>
        <div>{`role: ${user.role}`}</div>
      </>
    </AppLayout>
  );
};

export default ProfileIndexPage;
