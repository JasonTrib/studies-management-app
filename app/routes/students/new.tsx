import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormInput from "~/components/form/FormInput";
import FormSelect from "~/components/form/FormSelect";
import type { studentUserDataT } from "~/DAO/userDAO.server";
import { createStudent } from "~/DAO/userDAO.server";
import styles from "~/styles/form.css";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/studentSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const { formData, errors } = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(errors) || formData === null) return { formData, errors };

  const data: studentUserDataT = {
    dep_id: formData.dep,
    username: formData.username,
    password: formData.password,
    role: "STUDENT",
    enrollment_year: parseInt(formData.enrollmentYear),
    studies_status: formData.studiesStatus,
  };

  await createStudent(data);

  return redirect("/students");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return { dep: "IT" };
};

const StudentNewPage = () => {
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
        <h2 className="heading">New student</h2>
        <div className="form-container">
          <Form method="post" action="/students/new" className="form" autoComplete="off">
            <div className="form-fields fields-separator">
              <FormInput
                text="Username"
                label="username"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.username}
              />
              <FormInput
                text="Password"
                label="password"
                type="password"
                disabled={isSubmitting}
                error={actionData?.errors?.password}
              />
              <FormInput
                text="Confirm password"
                label="confirmPassword"
                type="password"
                disabled={isSubmitting}
                error={actionData?.errors?.confirmPassword}
              />
            </div>
            <div className="form-fields">
              <FormInput
                text="Enrollment year"
                label="enrollmentYear"
                type="number"
                defaultValue={new Date().getFullYear()}
                disabled={isSubmitting}
                error={actionData?.errors?.enrollmentYear}
              />
              <FormSelect
                text="Studies status"
                label="studiesStatus"
                values={["UNDERGRADUATE", "POSTGRADUATE", "ALUM"]}
                defaultValue={"UNDERGRADUATE"}
                disabled={isSubmitting}
                error={actionData?.errors?.studiesStatus}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="dep" name="dep" value={dep} />
              <button className="form-reset" type="reset" disabled={isSubmitting}>
                ✖
              </button>
              <button className="action-button submit-button" type="submit" disabled={isSubmitting}>
                SUBMIT
              </button>
            </div>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentNewPage;
