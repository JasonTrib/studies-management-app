import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import { useState } from "react";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import FormInput from "~/components/form/FormInput";
import FormSelect from "~/components/form/FormSelect";
import FormTabs from "~/components/form/FormTabs";
import Page from "~/components/layout/Page";
import Modal from "~/components/Modal";
import { links as TableLinks } from "~/components/Table";
import type { getProfessorUserShortExtended } from "~/DAO/composites/composites.server";
import type { getCourse } from "~/DAO/courseDAO.server";
import type { getProfessors } from "~/DAO/professorDAO.server";
import { getProfessorFromUserId, updateProfessor } from "~/DAO/professorDAO.server";
import { getRegistrarFromUserId, updateRegistrar } from "~/DAO/registrarDAO.server";
import type { StudentModelT, updateStudentDataT } from "~/DAO/studentDAO.server";
import { getStudentFromUserId, updateStudent } from "~/DAO/studentDAO.server";
import { getUser } from "~/DAO/userDAO.server";
import { PROFESSOR_TITLES, STUDENT_STUDIES_STATUSES, USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import modalStyles from "~/styles/modal.css";
import { bc_users_id_edit } from "~/utils/breadcrumbs";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import { paramToInt } from "~/utils/utils";
import type { FormValidationT } from "~/validations/formValidation.server";
import { extractAndValidateFormData } from "~/validations/formValidation.server";
import { editProfessorSchema } from "~/validations/schemas/professorSchemas.server";
import { editRegistrarSchema } from "~/validations/schemas/registrarShemas.server";
import { editStudentSchema } from "~/validations/schemas/studentSchemas.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: modalStyles },
    ...TableLinks(),
  ];
};

type SchemaT = z.infer<typeof editRegistrarSchema>;
type Schema2T = z.infer<typeof editProfessorSchema>;
type Schema3T = z.infer<typeof editStudentSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const userId = paramToInt(params.userId);
  if (userId == null) throw new Response("Not Found", { status: 404 });
  const user = await getUser(userId);
  if (user === null) return new Response("Not Found", { status: 404 });

  const activeUser = await requireUser(request);
  if (activeUser === null) return logout(request);
  if (activeUser.dep_id !== user.dep_id) throw new Response("Forbidden", { status: 403 });

  let form;
  let redirectTo;
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.SUPERADMIN);

      form = await extractAndValidateFormData<SchemaT>(request, editRegistrarSchema);
      if (!_.isEmpty(form.errors) || form.data === null) {
        return json(form, { status: 400 });
      }
      await updateRegistrar(user.id, form.data.title);

      redirectTo = form.data.redirectTo;
      break;
    case USER_ROLE.PROFESSOR:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.REGISTRAR);

      form = await extractAndValidateFormData<Schema2T>(request, editProfessorSchema);
      if (!_.isEmpty(form.errors) || form.data === null) {
        return json(form, { status: 400 });
      }
      await updateProfessor(user.id, form.data.title);

      redirectTo = form.data.redirectTo;
      break;
    case USER_ROLE.STUDENT:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.REGISTRAR);

      form = await extractAndValidateFormData<Schema3T>(request, editStudentSchema);
      if (!_.isEmpty(form.errors) || form.data === null) {
        return json(form, { status: 400 });
      }

      const data: updateStudentDataT = {
        enrollmentYear: parseInt(form.data.enrollmentYear),
        studiesStatus: form.data.studiesStatus,
      };
      await updateStudent(user.id, data);

      redirectTo = form.data.redirectTo;
      break;
    default:
      throw new Response("Forbidden", { status: 403 });
  }

  return redirect(redirectTo || "/users");
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users_id_edit>>;
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
  course: Exclude<Awaited<ReturnType<typeof getCourse>>, null>;
  professorsLecturing: Awaited<ReturnType<typeof getProfessorUserShortExtended>>;
  profsNotLecturing: Awaited<ReturnType<typeof getProfessors>>;
  user: Exclude<Awaited<ReturnType<typeof getUser>>, null>;
  userOptions: {
    enrollmentYear: StudentModelT["enrollment_year"];
    studiesStatus: StudentModelT["studies_status"];
    title: string;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = paramToInt(params.userId);
  if (userId == null) throw new Response("Not Found", { status: 404 });
  const user = await getUser(userId);
  if (user === null) return new Response("Not Found", { status: 404 });

  const activeUser = await requireUser(request);
  if (activeUser === null) return logout(request);
  if (activeUser.dep_id !== user.dep_id) throw new Response("Forbidden", { status: 403 });

  const userOptions = {
    enrollmentYear: NaN,
    studiesStatus: "",
    title: "",
  };
  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.SUPERADMIN);

      const registrar = await getRegistrarFromUserId(user.id);
      if (!registrar) throw new Error();
      userOptions.title = registrar.title;
      break;
    case USER_ROLE.PROFESSOR:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.REGISTRAR);

      const professor = await getProfessorFromUserId(user.id);
      if (!professor) throw new Error();
      userOptions.title = professor.title;
      break;
    case USER_ROLE.STUDENT:
      preventUnlessHasAccess(activeUser.role, USER_ROLE.REGISTRAR);

      const student = await getStudentFromUserId(user.id);
      if (!student) throw new Error();
      userOptions.enrollmentYear = student.enrollment_year;
      userOptions.studiesStatus = student.studies_status;
      break;
    default:
      throw new Error();
  }

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users_id_edit(path);

  return {
    breadcrumbData,
    user: user,
    userOptions,
  };
};

type ActionDataT =
  | (FormValidationT<SchemaT> & FormValidationT<Schema2T> & FormValidationT<Schema3T>)
  | undefined;

const UserEditPage = () => {
  const { breadcrumbData, user, userOptions } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const isReg = user.role === "REGISTRAR";
  const isProf = user.role === "PROFESSOR";
  const isStud = user.role === "STUDENT";
  const userType = _.capitalize(user.role);
  const editRedirectTo = `users/${user.id}/profile`;
  const deleteRedirectTo = `users/${user.role.toLowerCase()}s`;
  const options = ["Edit", "Delete"];
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <FormTabs tabs={options} selected={selected} setSelected={setSelected} />
        {selected === options[0] && (
          <div className="form-container">
            <Form method="post" action="#" className="form" autoComplete="off">
              <div className="form-fields">
                {isStud && (
                  <>
                    <FormInput
                      text="Enrollment year"
                      label="enrollmentYear"
                      type="number"
                      defaultValue={userOptions.enrollmentYear}
                      disabled={isBusy}
                      error={actionData?.errors?.enrollmentYear}
                    />
                    <FormSelect
                      text="Studies status"
                      label="studiesStatus"
                      values={STUDENT_STUDIES_STATUSES}
                      defaultValue={userOptions.studiesStatus}
                      disabled={isBusy}
                      error={actionData?.errors?.studiesStatus}
                    />
                  </>
                )}
                {isReg && (
                  <FormInput
                    text="Title"
                    label="title"
                    type="text"
                    defaultValue={userOptions.title}
                    disabled={isBusy}
                    error={actionData?.errors?.title}
                  />
                )}
                {isProf && (
                  <FormSelect
                    text="Title"
                    label="title"
                    values={PROFESSOR_TITLES}
                    defaultValue={userOptions.title}
                    disabled={isBusy}
                    error={actionData?.errors?.title}
                  />
                )}
              </div>
              <div className="form-submit">
                <input type="hidden" id="redirectTo" name="redirectTo" value={editRedirectTo} />
                <button className="form-reset" type="reset" disabled={isBusy}>
                  ✖
                </button>
                <ActionButton type="submit" disabled={isBusy}>
                  SUBMIT
                </ActionButton>
              </div>
            </Form>
          </div>
        )}
        {selected === options[1] && (
          <div className="form-container">
            <div className="form">
              <div className="form-fields">
                <FormInput
                  text={userType}
                  label="user"
                  type="text"
                  defaultValue={user.username}
                  disabled
                />
              </div>
              <div className="mb-28">
                <ActionButton onClick={openModal} variant="danger" fullwidth>
                  DELETE
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="modal-heading">
          Are you sure you want to <b>permanently</b> delete this user?
        </div>
        <div className="modal-actions">
          <Form method="post" action={`/users/${user.id}/delete`} autoComplete="off">
            <input type="hidden" id="redirectTo" name="redirectTo" value={deleteRedirectTo} />
            <ActionButton type="submit" disabled={isBusy} variant="danger" fullwidth>
              DELETE
            </ActionButton>
          </Form>
          <ActionButton onClick={closeModal} variant="cancel" size="lg">
            CANCEL
          </ActionButton>
        </div>
      </Modal>
    </Page>
  );
};

export default UserEditPage;
