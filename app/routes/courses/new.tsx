import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import CourseForm from "~/components/form/CourseForm";
import Page from "~/components/layout/Page";
import type { courseDataT } from "~/DAO/courseDAO.server";
import { getCourseOnTitle } from "~/DAO/courseDAO.server";
import { createCourse } from "~/DAO/courseDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { bc_courses_new } from "~/utils/breadcrumbs";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { courseSchema } from "~/validations/schemas/courseSchemas.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof courseSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const form = await extractAndValidateFormData<SchemaT>(request, courseSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const course = await getCourseOnTitle(form.data.title);
  if (course !== null) {
    return json(
      {
        data: null,
        errors: { title: "This title already exists" },
      },
      { status: 400 },
    );
  }

  const data: courseDataT = {
    dep_id: form.data.dep,
    title: form.data.title,
    description: form.data.description,
    semester: parseInt(form.data.semester),
    is_compulsory: form.data.isCompulsory === "on" ? true : false,
    is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
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
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_new(path);

  return { breadcrumbData, dep: user.dep_id };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CoursesNewPage = () => {
  const { breadcrumbData, dep } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <div className="form-container">
          <CourseForm
            action={`/courses/new`}
            dep={dep}
            disabled={isBusy}
            errors={actionData?.errors}
          />
        </div>
      </div>
    </Page>
  );
};

export default CoursesNewPage;
