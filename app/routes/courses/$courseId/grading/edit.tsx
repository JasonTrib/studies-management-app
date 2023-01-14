import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import _ from "lodash";
import type { z } from "zod";
import { gradeStudentCourse } from "~/DAO/studentCourseDAO.server";
import { USER_ROLE } from "~/data/data";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import { paramToInt } from "~/utils/utils";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { gradingSchema } from "~/validations/schemas/miscSchemas.server";

type SchemaT = z.infer<typeof gradingSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "PUT") throw new Response("Method Not Allowed", { status: 405 });
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.PROFESSOR);

  const form = await extractAndValidateFormData<SchemaT>(request, gradingSchema);
  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  for (const [studentId, grade] of Object.entries(form.data)) {
    if (grade) {
      await gradeStudentCourse(courseId, parseInt(studentId), parseInt(grade));
    }
  }

  return null;
};
