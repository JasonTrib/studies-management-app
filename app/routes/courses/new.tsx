import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import type { courseDataT } from "~/DAO/courseDAO.server";
import { createCourse } from "~/DAO/courseDAO.server";
import styles from "~/styles/form.css";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const { formData, errors } = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(errors) || formData === null) return { formData, errors };

  const data: courseDataT = {
    dep_id: formData.dep,
    title: formData.title,
    description: formData.description || undefined,
    semester: formData.semester,
    is_elective: formData.isElective === "on" ? true : false,
    is_postgraduate: formData.isPostgraduate === "on" ? true : false,
    is_public: formData.isPublic === "on" ? true : false,
  };

  await createCourse(data);

  return redirect("/courses");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return { dep: "IT" };
};

const CoursesNewPage = () => {
  const { dep } = useLoaderData();
  const actionData = useActionData() as {
    formData: SchemaT;
    errors: SchemaErrorsT<SchemaT> | null;
  } | null;
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
