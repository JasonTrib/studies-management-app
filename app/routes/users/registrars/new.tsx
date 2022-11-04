import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import bcrypt from "bcryptjs";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormInput from "~/components/form/FormInput";
import Page from "~/components/layout/Page";
import type { registrarUserDataT } from "~/DAO/userDAO.server";
import { createRegistrar, getUserOnUsername } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { bc_users_regs_new } from "~/utils/breadcrumbs";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { newRegistrarSchema } from "~/validations/schemas/registrarShema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof newRegistrarSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const form = await extractAndValidateFormData<SchemaT>(request, newRegistrarSchema);
  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const conflictingUser = await getUserOnUsername(form.data.username);
  if (conflictingUser !== null) {
    return json(
      {
        data: null,
        errors: { username: "This username already exists" },
      },
      { status: 400 },
    );
  }

  const data: registrarUserDataT = {
    dep_id: form.data.dep,
    username: form.data.username,
    password: await bcrypt.hash(form.data.password, 10),
    role: "REGISTRAR",
    title: form.data.title,
  };

  await createRegistrar(data);

  return redirect("users/registrars");
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_regs_new>>;
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.SUPERADMIN);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_regs_new(path);

  return { breadcrumbData, dep: user.dep_id };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const RegistrarsNewPage = () => {
  const { breadcrumbData, dep } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <div className="form-container">
          <Form method="post" action="#" className="form" autoComplete="off">
            <div className="form-fields fields-separator">
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
              <FormInput
                text="Confirm password"
                label="confirmPassword"
                type="password"
                disabled={isBusy}
                error={actionData?.errors?.confirmPassword}
              />
            </div>
            <div className="form-fields">
              <FormInput
                text="Title"
                label="title"
                type="text"
                disabled={isBusy}
                error={actionData?.errors?.title}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="dep" name="dep" value={dep} />
              <button className="form-reset" type="reset" disabled={isBusy}>
                ✖
              </button>
              <ActionButton type="submit" disabled={isBusy}>
                SUBMIT
              </ActionButton>
            </div>
          </Form>
        </div>
      </div>
    </Page>
  );
};

export default RegistrarsNewPage;
