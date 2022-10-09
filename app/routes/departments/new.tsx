import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import format from "date-fns/format";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormDatePicker from "~/components/form/FormDatePicker";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
import Page from "~/components/layout/Page";
import type { departmentDataT } from "~/DAO/departmentDAO.server";
import { createDepartment } from "~/DAO/departmentDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { bc_deps_new } from "~/utils/breadcrumbs";
import { throwUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { newDepartmentSchema } from "~/validations/schemas/departmentSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof newDepartmentSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const form = await extractAndValidateFormData<SchemaT>(request, newDepartmentSchema);
  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const codeId = form.data.code.toUpperCase();
  let foundationDate;
  const parsedDate = Date.parse(form.data.foundationDate);
  if (!isNaN(parsedDate)) {
    foundationDate = new Date(parsedDate).toISOString();
  } else {
    foundationDate = "";
  }

  const data: departmentDataT = {
    code_id: codeId,
    title: form.data.title,
    description: form.data.description,
    address: form.data.address,
    email: form.data.email,
    telephone: form.data.telephone,
    foundation_date: foundationDate,
  };

  await createDepartment(data);

  return redirect(`/departments/${codeId}`);
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_deps_new>>;
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  throwUnlessHasAccess(user.role, USER_ROLE.SUPERADMIN);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_deps_new(path);

  return { breadcrumbData, dep: user.dep_id };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const DepartmentNewPage = () => {
  const { breadcrumbData, dep } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const formattedFoundationDate = format(new Date(), "yyyy-MM-dd");

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-page">
        <div className="form-container">
          <Form method="post" action="#" className="form" autoComplete="off">
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

export default DepartmentNewPage;
