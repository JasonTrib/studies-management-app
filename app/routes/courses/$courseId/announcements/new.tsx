import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormInput from "~/components/form/FormInput";
import FormTextarea from "~/components/form/FormTextarea";
import Page from "~/components/layout/Page";
import type { announcementDataT } from "~/DAO/announcementDAO.server";
import { createAnnouncement } from "~/DAO/announcementDAO.server";
import { getIsProfessorLecturingCourse } from "~/DAO/composites/composites.server";
import { getProfessorId } from "~/DAO/professorDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import { bc_courses_id_anns_new } from "~/utils/breadcrumbs";
import { paramToInt } from "~/utils/utils";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { newAnnouncementSchema } from "~/validations/schemas/announcementSchemas.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof newAnnouncementSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "POST") throw new Response("Method Not Allowed", { status: 405 });
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.PROFESSOR);

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

  return redirect(`/courses/${courseId}/announcements`);
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_anns_new>>;
  courseId: number;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

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
      if (!isAuthorized) throw new Response("Forbidden", { status: 403 });
      break;
    case USER_ROLE.STUDENT:
      throw new Response("Forbidden", { status: 403 });
    default:
      throw new Response("Unauthorized", { status: 401 });
  }
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_anns_new(path);

  return { breadcrumbData, courseId };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const AnnouncementsNewPage = () => {
  const { breadcrumbData, courseId } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
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
                disabled={isBusy}
                error={actionData?.errors?.title}
              />
              <FormTextarea
                text="Body"
                label="body"
                disabled={isBusy}
                error={actionData?.errors?.body}
              />
            </div>
            <div className="form-submit">
              <input type="hidden" id="courseId" name="courseId" value={courseId} />
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

export default AnnouncementsNewPage;
