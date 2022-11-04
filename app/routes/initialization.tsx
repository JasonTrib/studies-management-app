import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { format } from "date-fns";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormDatePicker from "~/components/form/FormDatePicker";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
import BarePage from "~/components/layout/BarePage";
import type { departmentWithUserDataT } from "~/DAO/departmentDAO.server";
import { createDepartmentWithSuperadmin } from "~/DAO/departmentDAO.server";
import {
  INIT_POSTGRAD_CURRICULUM,
  INIT_REGISTRATION_PERIODS,
  INIT_UNDERGRAD_CURRICULUM,
} from "~/data/initializationData";
import formStyles from "~/styles/form.css";
import { createUserSession, login } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { initSchema } from "~/validations/schemas/miscSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: formStyles }];
};

type SchemaT = z.infer<typeof initSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const form = await extractAndValidateFormData<SchemaT>(request, initSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  let foundationDate;
  const parsedDate = Date.parse(form.data.foundationDate);
  if (!isNaN(parsedDate)) {
    foundationDate = new Date(parsedDate).toISOString();
  } else {
    foundationDate = "";
  }
  const codeId = form.data.code.toUpperCase();

  const data: departmentWithUserDataT = {
    code_id: codeId,
    title: form.data.title,
    description: form.data.description,
    address: form.data.address,
    email: form.data.email,
    telephone: form.data.telephone,
    foundation_date: foundationDate,
    username: form.data.username,
    password: await bcrypt.hash(form.data.password, 10),
    role: "SUPERADMIN",
    undergrad: INIT_UNDERGRAD_CURRICULUM,
    postgrad: INIT_POSTGRAD_CURRICULUM,
    registration_periods: INIT_REGISTRATION_PERIODS,
  };

  await createDepartmentWithSuperadmin(data);
  const user = await login({ username: form.data.username, password: form.data.password });
  if (!user) throw new Error();

  return createUserSession(`${user.id}`, "/");
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const InitializationPage = () => {
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const formattedFoundationDate = format(new Date(), "yyyy-MM-dd");

  return (
    <BarePage>
      <div className="form-layout">
        <div className="form-container">
          <Form method="post" action={`#`} autoComplete="off">
            <div className="form">
              <div className="form-heading">Superadmin</div>
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
                <FormInput
                  text="Confirm password"
                  label="confirmPassword"
                  type="password"
                  disabled={isBusy}
                  error={actionData?.errors?.confirmPassword}
                />
              </div>
            </div>
            <div className="form">
              <div className="form-heading">Department</div>
              <div className="form-fields fields-separator">
                <FormInput
                  text="Code"
                  label="code"
                  type="text"
                  disabled={isBusy}
                  error={actionData?.errors?.code}
                />
                <FormInput
                  text="Title"
                  label="title"
                  type="text"
                  disabled={isBusy}
                  error={actionData?.errors?.title}
                />
              </div>
              <div className="form-fields">
                <FormTextarea
                  text="Description"
                  label="description"
                  disabled={isBusy}
                  error={actionData?.errors?.description}
                />
                <FormInput
                  text="Address"
                  label="address"
                  type="text"
                  disabled={isBusy}
                  error={actionData?.errors?.address}
                />
                <FormInput
                  text="Email"
                  label="email"
                  type="email"
                  disabled={isBusy}
                  error={actionData?.errors?.email}
                />
                <FormInput
                  text="Telephone"
                  label="telephone"
                  type="tel"
                  disabled={isBusy}
                  error={actionData?.errors?.telephone}
                />
                <FormDatePicker
                  text="Foundation date"
                  label="foundationDate"
                  defaultValue={formattedFoundationDate}
                  disabled={isBusy}
                  error={actionData?.errors?.foundationDate}
                />
              </div>
            </div>
            <div className="form-submit my-32">
              <ActionButton type="submit" disabled={isBusy} fullwidth>
                INITIALIZE
              </ActionButton>
            </div>
          </Form>
        </div>
      </div>
    </BarePage>
  );
};

export default InitializationPage;
