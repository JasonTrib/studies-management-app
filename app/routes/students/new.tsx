import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import styles from "~/styles/form.css";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/createStudentSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const { formData, errors } = await validateFormData<SchemaT>(request, formSchema);

  console.log("...calculating...");
  for (let i = 0; i < 1_000_000_000; i++);

  if (!_.isEmpty(errors)) return { formData, errors };

  console.log("query db...");

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
              <div className="field">
                <label className="label" htmlFor="username">
                  <span className="field-text">Username</span>
                  <input
                    type="text"
                    id="username"
                    disabled={isSubmitting}
                    name="username"
                    className={`field-input ${actionData?.errors?.username ? "invalid-input" : ""}`}
                  />
                </label>
                {actionData?.errors?.username && (
                  <span className="error">{actionData?.errors?.username}</span>
                )}
              </div>
              <div className="field">
                <label className="label" htmlFor="password">
                  <span className="field-text">Password</span>
                  <input
                    type="password"
                    id="password"
                    disabled={isSubmitting}
                    name="password"
                    className={`field-input ${actionData?.errors?.password ? "invalid-input" : ""}`}
                  />
                </label>
                {actionData?.errors?.password && (
                  <span className="error">{actionData?.errors?.password}</span>
                )}
              </div>
              <div className="field">
                <label className="label" htmlFor="confirmPassword">
                  <span className="field-text">Confirm password</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    disabled={isSubmitting}
                    name="confirmPassword"
                    className={`field-input ${
                      actionData?.errors?.confirmPassword ? "invalid-input" : ""
                    }`}
                  />
                </label>
                {actionData?.errors?.confirmPassword && (
                  <span className="error">{actionData?.errors?.confirmPassword}</span>
                )}
              </div>
            </div>
            <div className="form-fields">
              <div className="field">
                <label className="label" htmlFor="enrollmentYear">
                  <span className="field-text">Enrollment year</span>
                  <input
                    type="number"
                    id="enrollmentYear"
                    name="enrollmentYear"
                    disabled={isSubmitting}
                    defaultValue={new Date().getFullYear()}
                    className={`field-input ${
                      actionData?.errors?.enrollmentYear ? "invalid-input" : ""
                    }`}
                  />
                </label>
                {actionData?.errors?.enrollmentYear && (
                  <span className="error">{actionData?.errors?.enrollmentYear}</span>
                )}
              </div>
              <div className="field">
                <label className="label" htmlFor="enrollmentStatus">
                  <span className="field-text">Enrollment status</span>
                  <select
                    id="enrollmentStatus"
                    name="enrollmentStatus"
                    disabled={isSubmitting}
                    defaultValue={"UNDERGRADUATE"}
                    className={`field-input field-select-height ${
                      actionData?.errors?.enrollmentStatus ? "invalid-input" : ""
                    }`}
                  >
                    <option value="UNDERGRADUATE">UNDERGRADUATE</option>
                    <option value="POSTGRADUATE">POSTGRADUATE</option>
                    <option value="ALUM">ALUM</option>
                  </select>
                </label>
                {actionData?.errors?.enrollmentStatus && (
                  <span className="error">{actionData?.errors?.enrollmentStatus}</span>
                )}
              </div>
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
