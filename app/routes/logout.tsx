import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") throw new Response("Method Not Allowed", { status: 405 });
  return logout(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/");
};
