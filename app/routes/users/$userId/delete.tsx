import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteUser, getUser } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import { paramToInt } from "~/utils/utils";
import { logout, requireUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = paramToInt(params.userId);
  if (userId == null) throw new Response("Not Found", { status: 404 });

  const activeUser = await requireUser(request);
  if (activeUser === null) return logout(request);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  const redirectTo = `${body["redirectTo"]}` || "/users";

  const user = await getUser(userId);
  if (user == null) throw new Response("Not Found", { status: 404 });
  if (activeUser.dep_id !== user.dep_id) throw new Response("Forbidden", { status: 403 });

  switch (activeUser.role) {
    case USER_ROLE.SUPERADMIN:
      break;
    case USER_ROLE.REGISTRAR:
      if (user.role === USER_ROLE.SUPERADMIN || user.role === USER_ROLE.REGISTRAR) {
        throw new Response("Forbidden", { status: 403 });
      }
      break;
    case USER_ROLE.PROFESSOR:
    case USER_ROLE.STUDENT:
      throw new Response("Forbidden", { status: 403 });
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  await deleteUser(userId);

  return redirect(redirectTo);
};
