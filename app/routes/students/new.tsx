import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import bcrypt from "bcryptjs";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormInput from "~/components/form/FormInput";
import FormSelect from "~/components/form/FormSelect";
import type { studentUserDataT } from "~/DAO/userDAO.server";
import { createStudent } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { newStudentSchema } from "~/validations/schemas/studentSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof newStudentSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const form = await extractAndValidateFormData<SchemaT>(request, newStudentSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: studentUserDataT = {
    dep_id: form.data.dep,
    username: form.data.username,
    password: await bcrypt.hash(form.data.password, 10),
    role: "STUDENT",
    enrollment_year: parseInt(form.data.enrollmentYear),
    studies_status: form.data.studiesStatus,
  };

  await createStudent(data);

  return redirect("/students");
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

  return { dep: user.dep_id };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const StudentNewPage = () => {
  const { dep } = useLoaderData();
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
      <div className="form-page">
        <h2 className="heading">New student</h2>
        <div className="form-container">
          <Form method="post" action="#" className="form" autoComplete="off">
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
              <button
                className="action-button primary submit-button"
                type="submit"
                disabled={isSubmitting}
              >
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
