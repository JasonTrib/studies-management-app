import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormCheckbox from "~/components/form/FormCheckbox";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
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

  console.log("...calculating...");
  for (let i = 0; i < 1_000_000_000; i++);

  if (!_.isEmpty(errors)) return { formData, errors };

  console.log("query db...");

  return redirect("/courses");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return { dep: "IT" };
};

const ProfessorsNewPage = () => {
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
          <Form method="post" action="/courses/new" className="form" autoComplete="off">
            <div className="form-fields">
              <FormInput
                text="Title"
                label="title"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.title}
              />
              <FormTextarea
                text="Description"
                label="description"
                disabled={isSubmitting}
                error={actionData?.errors?.description}
              />
              <FormInput
                text="Semester"
                label="semester"
                type="number"
                disabled={isSubmitting}
                error={actionData?.errors?.semester}
              />
              <FormCheckbox
                text="Elective"
                label="isElective"
                disabled={isSubmitting}
                error={actionData?.errors?.isElective}
              />
              <FormCheckbox
                text="Postgraduate"
                label="isPostgraduate"
                disabled={isSubmitting}
                error={actionData?.errors?.isPostgraduate}
              />
              <FormCheckbox
                text="Public"
                label="isPublic"
                disabled={isSubmitting}
                error={actionData?.errors?.isPublic}
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

export default ProfessorsNewPage;
