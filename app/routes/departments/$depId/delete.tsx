import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteDepartment } from "~/DAO/departmentDAO.server";
import { USER_ROLE } from "~/data/data";
import { logout, requireUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const depId = params.depId;
  if (depId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
      break;
    default:
      throw new Response("Forbidden", { status: 403 });
  }

  if (user.dep_id === depId) throw new Response("Method Not Allowed", { status: 405 });

  await deleteDepartment(depId);

  return redirect("/departments");
};
