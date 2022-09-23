import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteAnnouncement } from "~/DAO/announcementDAO.server";
import { getIsProfessorLecturingCourse } from "~/DAO/composites/composites.server";
import { getCourseIdFromAnnouncement } from "~/DAO/courseDAO.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const annId = paramToInt(params.annId);
  if (annId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      const course = await getCourseIdFromAnnouncement(annId);
      if (!course) throw new Error();

      const isLecturing = await getIsProfessorLecturingCourse(prof.id, course.id);
      if (!isLecturing) throw new Response("Unauthorized", { status: 401 });
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  await deleteAnnouncement(annId);

  const redirectTo = body.redirectTo ?? "/";

  return redirect(`${redirectTo}`);
};
