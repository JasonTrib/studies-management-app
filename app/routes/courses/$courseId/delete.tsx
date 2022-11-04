import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteCourse } from "~/DAO/courseDAO.server";
import { USER_ROLE } from "~/data/data";
import { paramToInt } from "~/utils/utils";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  await deleteCourse(courseId);

  return redirect("/courses");
};
