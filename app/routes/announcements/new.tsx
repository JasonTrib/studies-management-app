import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
import type { announcementDataT } from "~/DAO/announcementDAO.server";
import { createAnnouncement } from "~/DAO/announcementDAO.server";
import { getIsProfessorLecturingCourse } from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/announcementSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const courseId = paramToInt(url.searchParams.get("course") ?? undefined);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: announcementDataT = {
    course_id: courseId,
    title: form.data.title,
    body: form.data.body,
  };

  await createAnnouncement(data);

  return redirect("/announcements");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(new URL(request.url).searchParams.get("course") ?? undefined);
  if (courseId == null) {
    return redirect("/announcements");
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    case USER_ROLE.PROFESSOR:
      const prof = await getProfessorId(user.id);
      if (!prof) throw new Error();

      const isAuthorized = await getIsProfessorLecturingCourse(prof.id, courseId);
      if (!isAuthorized) {
        throw new Response("Unauthorized", { status: 401 });
      }
      break;
    case USER_ROLE.STUDENT:
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  return { courseId };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const AnnouncementsNewPage = () => {
  const { courseId } = useLoaderData();
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
      <div className="form-page">
        <h2 className="heading">New announcement</h2>
        <div className="form-container">
          <Form
            method="post"
            action={`/announcements/new?course=${courseId}`}
            className="form"
            autoComplete="off"
          >
            <div className="form-fields">
              <FormInput
                text="Title"
                label="title"
                type="text"
                disabled={isSubmitting}
                error={actionData?.errors?.title}
              />
              <FormTextarea
                text="Body"
                label="body"
                disabled={isSubmitting}
                error={actionData?.errors?.body}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="courseId" name="courseId" value={courseId} />
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

export default AnnouncementsNewPage;
