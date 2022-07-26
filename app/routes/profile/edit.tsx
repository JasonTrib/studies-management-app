import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormCheckbox from "~/components/form/FormCheckbox";
import FormInput from "~/components/form/FormInput";
import FormRadioGroup from "~/components/form/FormRadioGroup";
import FormTextarea from "~/components/form/FormTextarea";
import styles from "~/styles/form.css";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/profileSchema.server";

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

  return redirect("/profile");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  return { userId: 8 };
};

const ProfileEditPage = () => {
  const { userId } = useLoaderData();
  const actionData = useActionData() as {
    formData: SchemaT;
    errors: SchemaErrorsT<SchemaT> | null;
  } | null;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
      <div className="form-page">
        <h2 className="heading">Edit profile</h2>
        <div className="form-container">
          <Form method="post" action="/profile/edit" className="form" autoComplete="off">
            <div className="form-fields">
              <FormInput
                text="Name"
                label="name"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.name}
              />
              <FormInput
                text="Surname"
                label="surname"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.surname}
              />
              <FormInput
                text="Email"
                label="email"
                type="email"
                disabled={isSubmitting}
                error={actionData?.errors?.email}
              />
              <FormRadioGroup
                text="Gender"
                label="gender"
                values={["MALE", "FEMALE"]}
                disabled={isSubmitting}
                error={actionData?.errors?.gender}
              />
              <FormInput
                text="Phone"
                label="phone"
                type="tel"
                disabled={isSubmitting}
                error={actionData?.errors?.phone}
              />
              <FormInput
                text="Avatar"
                label="avatar"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.avatar}
              />
              <FormTextarea
                text="Info"
                label="info"
                disabled={isSubmitting}
                error={actionData?.errors?.info}
              />

              <FormCheckbox
                text="Public"
                label="isPublic"
                disabled={isSubmitting}
                error={actionData?.errors?.isPublic}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="userId" name="userId" value={userId} />
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

export default ProfileEditPage;
