import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import type { courseDataT, CourseModelT } from "~/DAO/courseDAO.server";
import { editCourse, getCourse } from "~/DAO/courseDAO.server";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: Omit<courseDataT, "dep_id"> = {
    id: courseId,
    title: form.data.title,
    description: form.data.description || undefined,
    semester: form.data.semester,
    is_elective: form.data.isElective === "on" ? true : false,
    is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
    is_public: form.data.isPublic === "on" ? true : false,
    updated_at: new Date().toISOString(),
  };

  await editCourse(data);

  return redirect(`/courses/${courseId}`);
};

type LoaderData = {
  dep: DepartmentModelT["title_id"];
  course: CourseModelT;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const course = await getCourse(courseId);
  if (!course) {
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

  return { dep: user.dep_id, course };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CourseEditPage = () => {
  const { dep, course } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
      <div className="form-page">
        <h2 className="heading">Edit course</h2>
        <div className="form-container">
          <CourseForm
            action={`/courses/${course.id}/edit`}
            dep={dep}
            defaultData={course}
            disabled={isSubmitting}
            errors={actionData?.errors}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseEditPage;
