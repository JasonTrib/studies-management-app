import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { paramToInt } from "~/utils/utils";

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.userId);
  if (id == null) throw new Response("Not Found", { status: 404 });

  return redirect(`/users/${id}/profile`);
};
