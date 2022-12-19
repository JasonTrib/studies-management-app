import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { useEffect, useState } from "react";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormCheckbox from "~/components/form/FormCheckbox";
import FormInput from "~/components/form/FormInput";
import FormRadioGroup from "~/components/form/FormRadioGroup";
import FormTabs from "~/components/form/FormTabs";
import FormTextarea from "~/components/form/FormTextarea";
import Page from "~/components/layout/Page";
import type { profileDataT } from "~/DAO/profileDAO.server";
import { getProfileOnEmail } from "~/DAO/profileDAO.server";
import { getProfile, updateProfile } from "~/DAO/profileDAO.server";
import { updateUserPassword } from "~/DAO/userDAO.server";
import styles from "~/styles/form.css";
import { bc_myprofile_edit } from "~/utils/breadcrumbs";
import { login, logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import { editProfileSchema } from "~/validations/schemas/profileSchemas.server";
import { editPasswordSchema } from "~/validations/schemas/miscSchemas.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type Schema1T = z.infer<typeof editProfileSchema>;
type Schema2T = z.infer<typeof editPasswordSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "updateProfile") {
    const form = validateFormData<Schema1T>(body, editProfileSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    if (form.data.email) {
      const profile = await getProfileOnEmail(form.data.email);
      if (profile !== null && profile.user_id !== parseInt(form.data.userId)) {
        return json(
          {
            data: null,
            errors: { email: "This email already exists" },
          },
          { status: 400 },
        );
      }
    }

    const data: profileDataT = {
      user_id: parseInt(form.data.userId),
      fullname: form.data.fullname,
      email: form.data.email,
      gender: form.data.gender === "MALE" ? "M" : form.data.gender === "FEMALE" ? "F" : undefined,
      phone: form.data.phone,
      info: form.data.info,
      is_public: form.data.isPublic === "on" ? true : false,
    };
    await updateProfile(data);
  }
  if (body["_action"] === "updatePassword") {
    const form = validateFormData<Schema2T>(body, editPasswordSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const user = await login({ username: form.data.username, password: form.data.oldPassword });
    if (!user) {
      return json({ ...form, authError: "Invalid credentials" }, { status: 400 });
    }
    await updateUserPassword(form.data.username, await bcrypt.hash(form.data.newPassword, 10));
  }

  return redirect("/my-profile");
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_myprofile_edit>>;
  profile: Exclude<Awaited<ReturnType<typeof getProfile>>, null>;
  username: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["username"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const profile = await getProfile(user.id);
  if (!profile) throw new Response("Not Found", { status: 404 });

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_myprofile_edit(path);

  return { breadcrumbData, profile, username: user.username };
};

type ActionDataT =
  | (FormValidationT<Schema1T> &
      FormValidationT<Schema2T> & {
        authError?: string;
      })
  | undefined;

const ProfileEditPage = () => {
  const { breadcrumbData, profile, username } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const options = ["Profile", "Account"];
  const [selected, setSelected] = useState(options[0]);
  const [revealChangePassword, setRevealChangePassword] = useState(false);

  const handleClick = () => {
    setRevealChangePassword(true);
  };

  useEffect(() => {
    setRevealChangePassword(false);
  }, [selected]);

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <div className="form-container">
          <FormTabs tabs={options} selected={selected} setSelected={setSelected} />
          {selected === options[0] && (
            <Form method="post" action="#" className="form" autoComplete="off">
              <div className="form-fields">
                <FormInput
                  text="Fullname"
                  label="fullname"
                  type="text"
                  defaultValue={profile.fullname || undefined}
                  disabled={isBusy}
                  error={actionData?.errors?.fullname}
                />
                <FormInput
                  text="Email"
                  label="email"
                  type="email"
                  defaultValue={profile.email || undefined}
                  disabled={isBusy}
                  error={actionData?.errors?.email}
                />
                <FormRadioGroup
                  text="Gender"
                  label="gender"
                  values={["MALE", "FEMALE"]}
                  defaultChecked={
                    profile.gender === "M" ? "MALE" : profile.gender === "F" ? "FEMALE" : undefined
                  }
                  disabled={isBusy}
                  error={actionData?.errors?.gender}
                />
                <FormInput
                  text="Phone"
                  label="phone"
                  type="tel"
                  defaultValue={profile.phone || undefined}
                  disabled={isBusy}
                  error={actionData?.errors?.phone}
                />
                <FormTextarea
                  text="About me"
                  label="info"
                  defaultValue={profile.info || undefined}
                  disabled={isBusy}
                  error={actionData?.errors?.info}
                />
                <FormCheckbox
                  text="Public"
                  label="isPublic"
                  defaultChecked={profile.is_public}
                  disabled={isBusy}
                  error={actionData?.errors?.isPublic}
                />
              </div>
              <div className="form-submit">
                <input type="hidden" id="userId" name="userId" value={profile.user_id} />
                <button className="form-reset" type="reset" disabled={isBusy}>
                  ✖
                </button>
                <ActionButton type="submit" name="_action" value="updateProfile" disabled={isBusy}>
                  SUBMIT
                </ActionButton>
              </div>
            </Form>
          )}
          {selected === options[1] && (
            <Form method="post" action="#" className="form" autoComplete="off">
              <div className="form-fields">
                <FormInput
                  text="Username"
                  label="_username"
                  type="text"
                  defaultValue={username}
                  disabled
                />
              </div>
              {revealChangePassword ? (
                <>
                  <div className="form-fields fields-separator">
                    <FormInput
                      text="Old password"
                      label="oldPassword"
                      type="password"
                      disabled={isBusy}
                      error={actionData?.errors?.oldPassword}
                    />
                  </div>
                  <div className="form-fields">
                    <FormInput
                      text="New password"
                      label="newPassword"
                      type="password"
                      disabled={isBusy}
                      error={actionData?.errors?.newPassword}
                    />
                    <FormInput
                      text="Confirm new password"
                      label="confirmNewPassword"
                      type="password"
                      disabled={isBusy}
                      error={actionData?.errors?.confirmNewPassword}
                    />
                  </div>
                  <div className="form-submit">
                    <input type="hidden" id="username" name="username" value={username} />
                    <button className="form-reset" type="reset" disabled={isBusy}>
                      ✖
                    </button>
                    <ActionButton
                      type="submit"
                      name="_action"
                      value="updatePassword"
                      disabled={isBusy}
                    >
                      SUBMIT
                    </ActionButton>
                    <div className="invalid">{actionData?.authError}</div>
                  </div>
                </>
              ) : (
                <div className="mb-28">
                  <ActionButton onClick={handleClick} fullwidth>
                    Change password
                  </ActionButton>
                </div>
              )}
            </Form>
          )}
        </div>
      </div>
    </Page>
  );
};

export default ProfileEditPage;
