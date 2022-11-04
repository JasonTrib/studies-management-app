import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import { useRef, useState } from "react";
import { z } from "zod";
import Page from "~/components/layout/Page";
import ActionButton from "~/components/buttons/ActionButton";
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
import {
  assignProfessorToCourse,
  unregisterProfessorFromCourse,
} from "~/DAO/professorCourseDAO.server";
import { getProfessors } from "~/DAO/professorDAO.server";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/form.css";
import modalStyles from "~/styles/modal.css";
import { bc_courses_id_edit } from "~/utils/breadcrumbs";
import { paramToInt } from "~/utils/utils";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import { courseSchema } from "~/validations/schemas/courseSchema.server";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";

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
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

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
    };

    await editCourse(data);

    return redirect(`/courses/${courseId}`);
  }
  if (body["_action"] === "unregisterProf") {
    const unregisterLecturerSchema = z.object({
      profId: z.string().regex(/^\d+$/, "Invalid id"),
    });
    type SchemaT2 = z.infer<typeof unregisterLecturerSchema>;
    const form = validateFormData<SchemaT2>(body, unregisterLecturerSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    await unregisterProfessorFromCourse(parseInt(form.data.profId), courseId);
  }
  if (body["_action"] === "assignProf") {
    const assignLecturerSchema = z.object({
      assignLecturer: z.string().regex(/^\d+$/, "Invalid id"),
    });
    type SchemaT3 = z.infer<typeof assignLecturerSchema>;
    const form = validateFormData<SchemaT3>(body, assignLecturerSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    await assignProfessorToCourse(parseInt(form.data.assignLecturer), courseId);
  }

  return null;
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_edit>>;
  dep: Exclude<Awaited<ReturnType<typeof requireUser>>, null>["dep_id"];
  course: Exclude<Awaited<ReturnType<typeof getCourse>>, null>;
  professorsLecturing: Awaited<ReturnType<typeof getProfessorUserShortExtended>>;
  profsNotLecturing: Awaited<ReturnType<typeof getProfessors>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const course = await getCourse(courseId);
  if (!course) throw new Response("Not Found", { status: 404 });

  const professorsLecturing = await getProfessorUserShortExtended(courseId);
  const professors = await getProfessors(user.dep_id);
  const profsNotLecturing = professors.reduce(
    (prev: Awaited<ReturnType<typeof getProfessors>>, curr) =>
      professorsLecturing.some((prof) => prof.id === curr.user_id) ? prev : [...prev, curr],
    [],
  );
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_edit(path);

  return { breadcrumbData, dep: user.dep_id, course, professorsLecturing, profsNotLecturing };
};

const MAX_LECTURERS_PER_COURSE = 3;

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CourseEditPage = () => {
  const { breadcrumbData, dep, course, professorsLecturing, profsNotLecturing } =
    useLoaderData() as LoaderDataT;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
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
  const hasTooManyLecturers = professorsLecturing.length >= MAX_LECTURERS_PER_COURSE;

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <div className="form-layout">
        <FormTabs tabs={options} selected={selected} setSelected={setSelected} />
        {selected === options[0] && (
          <div className="form-container">
            <CourseForm
              action={`/courses/${course.id}/edit`}
              _action="editCourse"
              dep={dep}
              defaultData={course}
              disabled={isBusy}
              errors={actionData?.errors}
            />
          </div>
        )}
        {selected === options[1] && (
          <div className="form-container wide">
            <div className="form">
              <Table data={professorsLecturing} noResultsMsg={"Course has no lecturers"}>
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
                      disabled={hasTooManyLecturers || hasAvailableProfs || isBusy}
                      error={actionData?.errors?.title}
                    />
                  </div>
                  <div className="mb-16">
                    <ActionButton
                      type="submit"
                      disabled={isBusy}
                      name="_action"
                      value={"assignProf"}
                      variant={hasTooManyLecturers || hasAvailableProfs ? "cancel" : "primary"}
                      fullwidth
                    >
                      ASSIGN
                    </ActionButton>
                  </div>
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
          Are you sure you want to <b>permanently</b> delete this course?
        </div>
        <div className="modal-actions">
          <Form method="post" action={`/courses/${course.id}/delete`} autoComplete="off">
            <ActionButton type="submit" disabled={isBusy} variant="danger" size="lg" fullwidth>
              DELETE
            </ActionButton>
          </Form>
          <ActionButton onClick={closeModal} variant="cancel" size="lg">
            CANCEL
          </ActionButton>
        </div>
      </Modal>
      <Modal isOpen={isOpen2} setIsOpen={setIsOpen2}>
        <div className="modal-heading">
          Are you sure you want to unregister this professor from the course?
        </div>
        <div className="modal-actions">
          <Form method="post" action={`/courses/${course.id}/edit`} autoComplete="off">
            <input type="hidden" id="profId" name="profId" value={profIdRef.current || ""} />
            <ActionButton
              type="submit"
              disabled={isBusy}
              name="_action"
              value={"unregisterProf"}
              onClick={closeModal2}
              variant="danger"
              fullwidth
            >
              REMOVE
            </ActionButton>
          </Form>
          <ActionButton variant="cancel" size="lg" onClick={closeModal2}>
            CANCEL
          </ActionButton>
        </div>
      </Modal>
    </Page>
  );
};

export default CourseEditPage;
