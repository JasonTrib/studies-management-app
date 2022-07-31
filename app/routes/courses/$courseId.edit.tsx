import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import AppLayout from "~/components/AppLayout";
import CourseForm from "~/components/form/CourseForm";
import type { courseDataT, CourseModelT } from "~/DAO/courseDAO.server";
import { editCourse } from "~/DAO/courseDAO.server";
import { getCourse } from "~/DAO/courseDAO.server";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";
import styles from "~/styles/form.css";
import { paramToInt } from "~/utils/paramToInt";
import type { SchemaErrorsT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import formSchema from "~/validations/schemas/courseSchema.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

type SchemaT = z.infer<typeof formSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const { formData, errors } = await validateFormData<SchemaT>(request, formSchema);

  if (!_.isEmpty(errors) || formData === null) return { formData, errors };

  const data: courseDataT = {
    id: courseId,
    dep_id: formData.dep,
    title: formData.title,
    description: formData.description || undefined,
    semester: formData.semester,
    is_elective: formData.isElective === "on" ? true : false,
    is_postgraduate: formData.isPostgraduate === "on" ? true : false,
    is_public: formData.isPublic === "on" ? true : false,
  };

  try {
    await editCourse(data);

    return redirect(`/courses/${courseId}`);
  } catch (error) {
    console.log(error);
    throw new Response("Server Error", {
      status: 500,
    });
  }
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

  return { dep: "IT", course };
};

const CourseEditPage = () => {
  const { dep, course } = useLoaderData() as LoaderData;
  const actionData = useActionData() as {
    formData: SchemaT;
    errors: SchemaErrorsT<SchemaT> | null;
  } | null;
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <AppLayout wide>
      <div className="form-page">
        <h2 className="heading">Edit course</h2>
        <div className="form-container">
          <CourseForm
            action={`/courses/${course.id}/edit`}
            dep={dep}
            defaultData={course}
            disabled={isSubmitting}
            errors={actionData?.errors}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default CourseEditPage;
