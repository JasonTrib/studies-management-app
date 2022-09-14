import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import { useRef, useState } from "react";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import FormInput from "~/components/form/FormInput";
import FormSelect from "~/components/form/FormSelect";
import FormTabs from "~/components/form/FormTabs";
import Modal from "~/components/Modal";
import Table, { links as TableLinks } from "~/components/Table";
import ProfessorsTableShort from "~/components/users/ProfessorsTableShort";
import { getProfessorUserShortExtended } from "~/DAO/composites/composites.server";
import type { courseDataT } from "~/DAO/courseDAO.server";
import { editCourse, getCourse } from "~/DAO/courseDAO.server";
import { getProfessors } from "~/DAO/professorDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import modalStyles from "~/styles/modal.css";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import { courseSchema } from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: modalStyles },
    ...TableLinks(),
  ];
};

type SchemaT = z.infer<typeof courseSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "editCourse") {
    const form = validateFormData<SchemaT>(body, courseSchema);

    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const data: Omit<courseDataT, "dep_id"> = {
      id: courseId,
      title: form.data.title,
      description: form.data.description,
      semester: parseInt(form.data.semester),
      is_elective: form.data.isElective === "on" ? true : false,
      is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
      is_public: form.data.isPublic === "on" ? true : false,
      updated_at: new Date().toISOString(),
    };

    await editCourse(data);
  }
  if (body["_action"] === "unregisterProf") {
    console.log("unregisterProf");
    console.log("body", body);

    return redirect(`/courses/${courseId}/edit`);
  }
  if (body["_action"] === "assignProf") {
    console.log("assignProf");
    console.log("body", body);

    return redirect(`/courses/${courseId}/edit`);
  }

  return redirect(`/courses/${courseId}`);
};

type LoaderDataT = {
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
  course: Exclude<Awaited<ReturnType<typeof getCourse>>, null>;
  professorsLecturing: Awaited<ReturnType<typeof getProfessorUserShortExtended>>;
  profsNotLecturing: Awaited<ReturnType<typeof getProfessors>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const course = await getCourse(courseId);
  if (!course) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  switch (user.role) {
    case USER_ROLE.SUPERADMIN:
    case USER_ROLE.REGISTRAR:
      break;
    default:
      throw new Response("Unauthorized", { status: 401 });
  }

  const professorsLecturing = await getProfessorUserShortExtended(courseId);
  const professors = await getProfessors(user.dep_id);
  const profsNotLecturing = professors.reduce(
    (prev: Awaited<ReturnType<typeof getProfessors>>, curr) =>
      professorsLecturing.some((prof) => prof.id === curr.user_id) ? prev : [...prev, curr],
    [],
  );

  return { dep: user.dep_id, course, professorsLecturing, profsNotLecturing };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CourseEditPage = () => {
  const { dep, course, professorsLecturing, profsNotLecturing } = useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const options = ["Edit", "Assign", "Delete"];
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const profIdRef = useRef<number>();
  const [isOpen2, setIsOpen2] = useState(false);
  const openModal2 = (profId: number) => {
    profIdRef.current = profId;
    setIsOpen2(true);
  };
  const closeModal2 = () => setIsOpen2(false);
  const hasAvailableProfs = profsNotLecturing.length === 0;
  const hasTooManyLecturers = professorsLecturing.length >= 3;

  return (
    <AppLayout wide>
      <div className="form-page">
        <FormTabs tabs={options} selected={selected} setSelected={setSelected} />
        {selected === options[0] && (
          <div className="form-container">
            <CourseForm
              action={`/courses/${course.id}/edit`}
              _action="editCourse"
              dep={dep}
              defaultData={course}
              disabled={isSubmitting}
              errors={actionData?.errors}
            />
          </div>
        )}
        {selected === options[1] && (
          <div className="form-container wide">
            <div className="form">
              <Table data={professorsLecturing} noResultsMsg={"undefined"}>
                <ProfessorsTableShort openModal={openModal2} />
              </Table>
              <div className="select-profs">
                <Form method="post" action={`#`} autoComplete="off">
                  <div className="form-fields">
                    <FormSelect
                      text="Assign lecturer"
                      label="assignLecturer"
                      values={profsNotLecturing.map((prof) => `${prof.id}`)}
                      optionsText={profsNotLecturing.map(
                        (prof) => `${prof.user.username} - ${prof.title}`,
                      )}
                      disabled={hasTooManyLecturers || hasAvailableProfs || isSubmitting}
                      error={actionData?.errors?.title}
                    />
                  </div>
                  <button
                    className="action-button primary submit-button full-width"
                    disabled={isSubmitting}
                    type="submit"
                    name="_action"
                    value={"assignProf"}
                  >
                    ASSIGN
                  </button>
                </Form>
              </div>
            </div>
          </div>
        )}
        {selected === options[2] && (
          <div className="form-container">
            <div className="form">
              <div className="form-fields">
                <FormInput
                  text="Course"
                  label="course"
                  type="text"
                  defaultValue={course.title}
                  disabled
                />
              </div>
              <button className="action-button danger" onClick={openModal}>
                DELETE
              </button>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="modal-heading">
          Are you sure you want to <b>permanently</b> delete this course?
        </div>
        <div className="modal-actions">
          <Form method="post" action={`/courses/${course.id}/delete`} autoComplete="off">
            <button
              className="action-button submit-button danger full-width"
              type="submit"
              disabled={isSubmitting}
            >
              DELETE
            </button>
          </Form>
          <button className="action-button submit-button" onClick={closeModal}>
            CANCEL
          </button>
        </div>
      </Modal>
      <Modal isOpen={isOpen2} setIsOpen={setIsOpen2}>
        <div className="modal-heading">
          Are you sure you want to unregister this professor from the course?
        </div>
        <div className="modal-actions">
          <Form method="post" action={`/courses/${course.id}/edit`} autoComplete="off">
            <input type="hidden" id="profId" name="profId" value={profIdRef.current || ""} />
            <button
              className="action-button submit-button danger full-width"
              type="submit"
              disabled={isSubmitting}
              name="_action"
              value={"unregisterProf"}
            >
              REMOVE
            </button>
          </Form>
          <button className="action-button submit-button" onClick={closeModal2}>
            CANCEL
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
};

export default CourseEditPage;
