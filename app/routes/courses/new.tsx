import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import type { courseDataT } from "~/DAO/courseDAO.server";
import { createCourse } from "~/DAO/courseDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { bc_courses_new } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { courseSchema } from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof courseSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const form = await extractAndValidateFormData<SchemaT>(request, courseSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: courseDataT = {
    dep_id: form.data.dep,
    title: form.data.title,
    description: form.data.description || undefined,
    semester: parseInt(form.data.semester),
    is_elective: form.data.isElective === "on" ? true : false,
    is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
    is_public: form.data.isPublic === "on" ? true : false,
  };

  await createCourse(data);

  return redirect("/courses");
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_new>>;
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_new(path);

  return { breadcrumbData, dep: user.dep_id };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CoursesNewPage = () => {
  const { breadcrumbData, dep } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide breadcrumbs={breadcrumbData}>
      <div className="form-page">
        <h2 className="heading">New course</h2>
        <div className="form-container">
          <CourseForm
            action={`/courses/new`}
            dep={dep}
            disabled={isSubmitting}
            errors={actionData?.errors}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CoursesNewPage;
