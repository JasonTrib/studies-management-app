import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import ActionButton from "~/components/buttons/ActionButton";
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
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { newAnnouncementSchema } from "~/validations/schemas/announcementSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof newAnnouncementSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  //   const courseId = paramToInt(url.searchParams.get("course") ?? undefined);
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const form = await extractAndValidateFormData<SchemaT>(request, newAnnouncementSchema);

  if (!_.isEmpty(form.errors) || form.data === null) {
    return json(form, { status: 400 });
  }

  const data: announcementDataT = {
    course_id: courseId,
    title: form.data.title,
    body: form.data.body,
  };

  await createAnnouncement(data);

  return redirect(`/courses/${courseId}`);
};

type LoaderDataT = {
  courseId: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  //   const courseId = paramToInt(new URL(request.url).searchParams.get("course") ?? undefined);
  const courseId = paramToInt(params.courseId);
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
  const { courseId } = useLoaderData() as LoaderDataT;
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
            action={`/courses/${courseId}/announcements/new`}
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
              <ActionButton type="submit" disabled={isSubmitting}>
                SUBMIT
              </ActionButton>
            </div>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnnouncementsNewPage;
