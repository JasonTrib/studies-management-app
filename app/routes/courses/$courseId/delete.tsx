import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteCourse } from "~/DAO/courseDAO.server";
import { USER_ROLE } from "~/data/data";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  await deleteCourse(courseId);

  return redirect("/courses");
};
