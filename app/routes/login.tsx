import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormInput from "~/components/form/FormInput";
import BarePage from "~/components/layout/BarePage";
import { GUEST_ID } from "~/data/data";
import styles from "~/styles/form.css";
import { createUserSession, getUserId, login } from "~/utils/session.server";
import { validateFormData, type FormValidationT } from "~/validations/formValidation.server";
import { loginSchema } from "~/validations/schemas/miscSchemas.server";

type SchemaT = z.infer<typeof loginSchema>;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "POST") throw new Response("Method Not Allowed", { status: 405 });

  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "userLogin") {
    const form = validateFormData<SchemaT>(body, loginSchema);

    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }
    const user = await login(form.data);
    if (!user) {
      return json({ ...form, authError: "Invalid credentials" }, { status: 400 });
    }
    return createUserSession(`${user.id}`, redirectTo);
  } else if (body["_action"] === "guestLogin") {
    return createUserSession(`${GUEST_ID}`, redirectTo);
  }

  return null;
};

export type LoaderDataT = {
  redirectTo: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const redirectTo = new URL(request.url).searchParams.toString();

  const user = await getUserId(request);
  if (user !== null) return redirect("/");

  return { redirectTo };
};

type ActionDataT =
  | (FormValidationT<SchemaT> & {
      authError?: string;
    })
  | undefined;

const LoginPage = () => {
  const actionData = useActionData() as ActionDataT;
  const { redirectTo } = useLoaderData() as LoaderDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <BarePage>
      <div className="form-layout">
        <div className="form-container">
          <Form method="post" action={`/login?${redirectTo}`} className="form" autoComplete="off">
            <div className="form-heading">Login</div>
            <div className="form-fields">
              <FormInput
                text="Username"
                label="username"
                type="text"
                disabled={isBusy}
                error={actionData?.errors?.username}
              />
              <FormInput
                text="Password"
                label="password"
                type="password"
                disabled={isBusy}
                error={actionData?.errors?.password}
              />
            </div>
            <div className="form-submit">
              <button className="form-reset" type="reset" disabled={isBusy}>
                ✖
              </button>
              <ActionButton type="submit" disabled={isBusy} name="_action" value={"userLogin"}>
                SUBMIT
              </ActionButton>
              <div className="invalid">{actionData?.authError}</div>
            </div>
          </Form>
          <Form method="post" action={`/login?${redirectTo}`} className="guest-login-form">
            <ActionButton
              type="submit"
              variant="cancel"
              disabled={isBusy}
              name="_action"
              value={"guestLogin"}
            >
              Login as Guest
            </ActionButton>
          </Form>
        </div>
      </div>
    </BarePage>
  );
};

export default LoginPage;
