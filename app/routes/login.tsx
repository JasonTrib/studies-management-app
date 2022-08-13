import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import FormInput from "~/components/form/FormInput";
import styles from "~/styles/form.css";
import { createUserSession, login } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/userSchema.server";

type SchemaT = z.infer<typeof formSchema>;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await extractAndValidateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const user = await login(form.data);

  if (!user) {
    return json({ ...form, authError: "Invalid credentials" }, { status: 400 });
  }

  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";

  return createUserSession(`${user.id}`, redirectTo);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const redirectTo = new URL(request.url).searchParams.toString();

  return json({ redirectTo });
};

type ActionDataT =
  | (FormValidationT<SchemaT> & {
      authError?: string;
    })
  | undefined;

const LoginPage = () => {
  const actionData = useActionData() as ActionDataT;
  const { redirectTo } = useLoaderData();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <div className="login-page">
      <div className="form-page pt-100">
        <h2 className="heading">Login</h2>
        <div className="form-container">
          <Form method="post" action={`/login?${redirectTo}`} className="form" autoComplete="off">
            <div className="form-fields">
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
            </div>
            <div className="form-submit">
              <button className="form-reset" type="reset" disabled={isSubmitting}>
                ✖
              </button>
              <button className="action-button submit-button" type="submit" disabled={isSubmitting}>
                SUBMIT
              </button>
              <div className="invalid">{actionData?.authError}</div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
