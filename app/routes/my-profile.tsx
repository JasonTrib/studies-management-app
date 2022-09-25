import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { getProfile } from "~/DAO/profileDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  userInfo: {
    username: UserModelT["username"];
    fullname: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["fullname"] | null;
    gender: Exclude<Awaited<ReturnType<typeof getProfile>>, null>["gender"] | null;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const profile = await getProfile(user.id);

  return {
    userInfo: {
      username: user.username,
      fullname: profile?.fullname,
      gender: profile?.gender,
    },
  };
};

const MyProfilePage = () => {
  const { userInfo } = useLoaderData() as LoaderDataT;

  return (
    <AppLayout userInfo={userInfo}>
      <Outlet />
    </AppLayout>
  );
};

export default MyProfilePage;
