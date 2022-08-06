import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormCheckbox from "~/components/form/FormCheckbox";
import FormInput from "~/components/form/FormInput";
import FormRadioGroup from "~/components/form/FormRadioGroup";
import FormTextarea from "~/components/form/FormTextarea";
import type { profileDataT, ProfileModelT } from "~/DAO/profileDAO.server";
import { getProfile, updateProfile } from "~/DAO/profileDAO.server";
import styles from "~/styles/form.css";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/profileSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const form = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: profileDataT = {
    user_id: parseInt(form.data.userId),
    fullname: form.data.fullname || undefined,
    email: form.data.email || undefined,
    gender: form.data.gender === "MALE" ? "M" : form.data.gender === "FEMALE" ? "F" : undefined,
    phone: form.data.phone || undefined,
    info: form.data.info || undefined,
    avatar: form.data.avatar || undefined,
    is_public: form.data.isPublic === "on" ? true : false,
    updated_at: new Date().toISOString(),
  };

  await updateProfile(data);

  return redirect("/profile");
};

type LoaderData = {
  profile: ProfileModelT;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = 8;

  const profile = await getProfile(userId);

  return { profile };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const ProfileEditPage = () => {
  const { profile } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionDataT;
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
                text="Fullname"
                label="fullname"
                type="text"
                defaultValue={profile.fullname || undefined}
                disabled={isSubmitting}
                error={actionData?.errors?.fullname}
              />
              <FormInput
                text="Email"
                label="email"
                type="email"
                defaultValue={profile.email || undefined}
                disabled={isSubmitting}
                error={actionData?.errors?.email}
              />
              <FormRadioGroup
                text="Gender"
                label="gender"
                values={["MALE", "FEMALE"]}
                defaultChecked={
                  profile.gender === "M" ? "MALE" : profile.gender === "F" ? "FEMALE" : undefined
                }
                disabled={isSubmitting}
                error={actionData?.errors?.gender}
              />
              <FormInput
                text="Phone"
                label="phone"
                type="tel"
                defaultValue={profile.phone || undefined}
                disabled={isSubmitting}
                error={actionData?.errors?.phone}
              />
              <FormInput
                text="Avatar"
                label="avatar"
                type="text"
                defaultValue={profile.avatar || undefined}
                disabled={isSubmitting}
                error={actionData?.errors?.avatar}
              />
              <FormTextarea
                text="Info"
                label="info"
                defaultValue={profile.info || undefined}
                disabled={isSubmitting}
                error={actionData?.errors?.info}
              />
              <FormCheckbox
                text="Public"
                label="isPublic"
                defaultChecked={profile.is_public}
                disabled={isSubmitting}
                error={actionData?.errors?.isPublic}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="userId" name="userId" value={profile.user_id} />
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
