import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getProfessor } from "~/DAO/professorDAO.server";
import { paramToInt } from "~/utils/paramToInt";

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.profId);
  if (id == null) throw new Response("Not Found", { status: 404 });

  const prof = await getProfessor(id);
  if (!prof) throw new Response("Not Found", { status: 404 });

  return redirect(`/users/${prof.user_id}/profile`);
};
