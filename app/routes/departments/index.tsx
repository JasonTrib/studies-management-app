import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout, requireUser } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  return redirect(`/departments/${user.dep_id}`);
};
