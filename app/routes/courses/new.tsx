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
import styles from "~/styles/form.css";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const form = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: courseDataT = {
    dep_id: form.data.dep,
    title: form.data.title,
    description: form.data.description || undefined,
    semester: form.data.semester,
    is_elective: form.data.isElective === "on" ? true : false,
    is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
    is_public: form.data.isPublic === "on" ? true : false,
  };

  await createCourse(data);

  return redirect("/courses");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return { dep: "IT" };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CoursesNewPage = () => {
  const { dep } = useLoaderData();
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
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
