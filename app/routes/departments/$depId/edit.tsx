import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { format } from "date-fns";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormDatePicker from "~/components/form/FormDatePicker";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
import Page from "~/components/layout/Page";
import { links as TableLinks } from "~/components/Table";
import type { departmentDataT } from "~/DAO/departmentDAO.server";
import { getDepartmentOnTitle } from "~/DAO/departmentDAO.server";
import { editDepartment, getDepartment } from "~/DAO/departmentDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import type { bc_courses_id_edit } from "~/utils/breadcrumbs";
import { bc_deps_id_edit } from "~/utils/breadcrumbs";
import { throwUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { editDepartmentSchema } from "~/validations/schemas/departmentSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...TableLinks()];
};

type SchemaT = z.infer<typeof editDepartmentSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const depId = params.depId;
  if (depId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  throwUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const form = await extractAndValidateFormData<SchemaT>(request, editDepartmentSchema);
  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const department = await getDepartmentOnTitle(form.data.title);
  if (department !== null && department.code_id !== form.data.dep) {
    return json(
      {
        data: null,
        errors: { title: "This title already exists" },
      },
      { status: 400 },
    );
  }

  let foundationDate;
  const parsedDate = Date.parse(form.data.foundationDate);
  if (!isNaN(parsedDate)) {
    foundationDate = new Date(parsedDate).toISOString();
  } else {
    foundationDate = "";
  }

  const data: departmentDataT = {
    code_id: form.data.dep,
    title: form.data.title,
    description: form.data.description,
    address: form.data.address,
    email: form.data.email,
    telephone: form.data.telephone,
    foundation_date: foundationDate,
    updated_at: new Date().toISOString(),
  };

  await editDepartment(data);

  return redirect(`/departments/${depId}`);
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_edit>>;
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const depId = params.depId;
  if (!depId) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  throwUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const department = await getDepartment(depId);
  if (department == null) throw new Response("Not Found", { status: 404 });

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_deps_id_edit(path);

  return { breadcrumbData, department };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const DepartmentsEditPage = () => {
  const { breadcrumbData, department } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const formattedFoundationDate = department.foundation_date
    ? format(new Date(department.foundation_date), "yyyy-MM-dd")
    : undefined;

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <div className="form-container">
          <Form method="post" action={"#"} className="form" autoComplete="off">
            <div className="form-fields">
              <FormInput
                text="Title"
                label="title"
                type="text"
                defaultValue={department.title}
                disabled={isBusy}
                error={actionData?.errors?.title}
              />
              <FormTextarea
                text="Description"
                label="description"
                defaultValue={department.description || undefined}
                disabled={isBusy}
                error={actionData?.errors?.description}
              />
              <FormInput
                text="Address"
                label="address"
                type="text"
                defaultValue={department.address || undefined}
                disabled={isBusy}
                error={actionData?.errors?.address}
              />
              <FormInput
                text="Email"
                label="email"
                type="email"
                defaultValue={department.email || undefined}
                disabled={isBusy}
                error={actionData?.errors?.email}
              />
              <FormInput
                text="Telephone"
                label="telephone"
                type="tel"
                defaultValue={department.telephone || undefined}
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
              <input type="hidden" id="dep" name="dep" value={department.code_id} />
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

export default DepartmentsEditPage;
