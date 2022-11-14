import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { draftStudentCourse, undraftStudentCourse } from "~/DAO/studentCourseDAO.server";
import { getStudentId } from "~/DAO/studentDAO.server";
import { USER_ROLE } from "~/data/data";
import { logout, requireUser } from "~/utils/session.server";
import { paramToInt } from "~/utils/utils";

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  switch (user.role) {
    case USER_ROLE.STUDENT:
      break;
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
    case USER_ROLE.PROFESSOR:
      throw new Response("Forbidden", { status: 403 });
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const student = await getStudentId(user.id);
  if (!student) throw new Error();

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  const courseId = paramToInt(`${body["courseId"]}`);
  if (courseId === null) throw new Response("Not Found", { status: 404 });

  if (body["_action"] === "draft") {
    await draftStudentCourse(student.id, courseId);
  }
  if (body["_action"] === "undraft") {
    await undraftStudentCourse(student.id, courseId);
  }
  if (body["_action"] === "register") {
    console.log(">>>REGISTER");
    // return redirect("/my-courses");
  }

  return redirect("/studies/course-registration");
};
