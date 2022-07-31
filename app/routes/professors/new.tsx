import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormInput from "~/components/form/FormInput";
import FormSelect from "~/components/form/FormSelect";
import type { professorUserDataT } from "~/DAO/userDAO.server";
import { createProfessor } from "~/DAO/userDAO.server";
import styles from "~/styles/form.css";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/professorSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const { formData, errors } = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(errors) || formData === null) return { formData, errors };

  const data: professorUserDataT = {
    dep_id: formData.dep,
    username: formData.username,
    password: formData.password,
    role: "PROFESSOR",
    title: formData.title,
  };

  try {
    await createProfessor(data);

    return redirect("/professors");
  } catch (error) {
    console.log(error);
    throw new Response("Server Error", {
      status: 500,
    });
  }
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
        <h2 className="heading">New professor</h2>
        <div className="form-container">
          <Form method="post" action="/professors/new" className="form" autoComplete="off">
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
              <FormSelect
                text="Title"
                label="title"
                values={[
                  "Lecturer",
                  "Assistant Professor",
                  "Associate Professor",
                  "Professor",
                  "Emeritus Professor",
                ]}
                defaultValue={"Professor"}
                disabled={isSubmitting}
                error={actionData?.errors?.title}
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
