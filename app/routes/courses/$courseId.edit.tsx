import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import { useState } from "react";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import FormInput from "~/components/form/FormInput";
import FormTabs from "~/components/form/FormTabs";
import Modal from "~/components/Modal";
import type { courseDataT, CourseModelT } from "~/DAO/courseDAO.server";
import { deleteCourse, editCourse, getCourse } from "~/DAO/courseDAO.server";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";
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
      description: form.data.description || undefined,
      semester: form.data.semester,
      is_elective: form.data.isElective === "on" ? true : false,
      is_postgraduate: form.data.isPostgraduate === "on" ? true : false,
      is_public: form.data.isPublic === "on" ? true : false,
      updated_at: new Date().toISOString(),
    };

    await editCourse(data);
  }
  if (body["_action"] === "assignCourse") {
  }
  if (body["_action"] === "deleteCourse") {
    await deleteCourse(courseId);

    return redirect("/courses");
  }

  return redirect(`/courses/${courseId}`);
};

type LoaderData = {
  dep: DepartmentModelT["title_id"];
  course: CourseModelT;
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

  return { dep: user.dep_id, course };
};

type ActionDataT = FormValidationT<SchemaT> | undefined;

const CourseEditPage = () => {
  const { dep, course } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionDataT;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";
  const options = ["Edit", "Assign", "Delete"];
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AppLayout wide>
      <div className="form-page">
        <div className="form-container">
          <FormTabs tabs={options} selected={selected} setSelected={setSelected} />
          {selected === options[0] && (
            <CourseForm
              action={`/courses/${course.id}/edit`}
              _action="editCourse"
              dep={dep}
              defaultData={course}
              disabled={isSubmitting}
              errors={actionData?.errors}
            />
          )}
          {selected === options[1] && <div className="form"></div>}
          {selected === options[2] && (
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
          )}
        </div>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className="modal-heading">
            Are you sure you want to <b>permanently</b> delete this course?
          </div>
          <div className="modal-actions">
            <Form method="post" action="#" autoComplete="off">
              <input type="hidden" id="courseId" name="courseId" value={course.id} />
              <button
                className="action-button submit-button danger full-width"
                type="submit"
                name="_action"
                value="deleteCourse"
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
      </div>
    </AppLayout>
  );
};

export default CourseEditPage;
