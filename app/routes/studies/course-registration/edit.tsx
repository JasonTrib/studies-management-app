import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { registerStudentCoursesCompulsories } from "~/DAO/composites/composites.server";
import {
  draftStudentCourse,
  registerStudentCourses,
  undraftStudentCourse,
  unregisterStudentCourses,
} from "~/DAO/studentCourseDAO.server";
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

  if (body["_action"] === "draft") {
    const courseId = paramToInt(`${body["courseId"]}`);
    if (courseId === null) throw new Response("Not Found", { status: 404 });
    await draftStudentCourse(student.id, courseId);
  }
  if (body["_action"] === "undraft") {
    const courseId = paramToInt(`${body["courseId"]}`);
    if (courseId === null) throw new Response("Not Found", { status: 404 });
    await undraftStudentCourse(student.id, courseId);
  }
  if (body["_action"] === "register") {
    const semester = parseInt(`${body["studentSemester"]}`);
    if (isNaN(semester)) throw new Error();
    const coursesToUnregister: number[] = JSON.parse(`${body["coursesPool"]}`);
    const electiveCoursesToRegister: number[] = JSON.parse(`${body["coursesToRegister"]}`);
    const isPostgrad = `${body["isPostgrad"]}` === "true";

    // unregister non-drafted courses
    // register AND undraft drafted courses
    // register to semester's compulsory courses
    await unregisterStudentCourses(student.id, coursesToUnregister);
    await registerStudentCourses(student.id, electiveCoursesToRegister);
    await registerStudentCoursesCompulsories(user.dep_id, student.id, semester, isPostgrad);

    return redirect("/my-courses");
  }

  return redirect("/studies/course-registration");
};
