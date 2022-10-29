import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import _ from "lodash";
import type { z } from "zod";
import Curriculum from "~/components/Curriculum";
import Page from "~/components/layout/Page";
import {
  getPostgradCurriculumCourses,
  getUndergradCurriculumCourses,
} from "~/DAO/composites/composites.server";
import {
  getStudiesCurriculum,
  updatePostgradStudiesCurriculum,
  updateUndergradStudiesCurriculum,
} from "~/DAO/studiesCurriculumDAO.server";
import type { curriculumDataT } from "~/data/data";
import styles from "~/styles/curriculum.css";
import tableStyles from "~/styles/table.css";
import { bc_studies_curriculum } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import { validateFormData } from "~/validations/formValidation.server";
import {
  postgradCurriculumSchema,
  undergradCurriculumSchema,
} from "~/validations/schemas/studiesCurriculumSchemas.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: tableStyles },
  ];
};

type SchemaT = z.infer<typeof undergradCurriculumSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "undergradCurriculum") {
    const form = validateFormData<SchemaT>(body, undergradCurriculumSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const curriculumData: curriculumDataT = [
      { semester: { electives: parseInt(form.data.sem1) } },
      { semester: { electives: parseInt(form.data.sem2) } },
      { semester: { electives: parseInt(form.data.sem3) } },
      { semester: { electives: parseInt(form.data.sem4) } },
      { semester: { electives: parseInt(form.data.sem5) } },
      { semester: { electives: parseInt(form.data.sem6) } },
      { semester: { electives: parseInt(form.data.sem7) } },
      { semester: { electives: parseInt(form.data.sem8) } },
    ];

    await updateUndergradStudiesCurriculum(user.dep_id, curriculumData);
  }
  if (body["_action"] === "postgradCurriculum") {
    const form = validateFormData<SchemaT>(body, postgradCurriculumSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const curriculumData: curriculumDataT = [
      { semester: { electives: parseInt(form.data.sem1) } },
      { semester: { electives: parseInt(form.data.sem2) } },
      { semester: { electives: parseInt(form.data.sem3) } },
      { semester: { electives: parseInt(form.data.sem4) } },
    ];

    await updatePostgradStudiesCurriculum(user.dep_id, curriculumData);
  }

  return null;
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_studies_curriculum>>;
  undergradCourses: Awaited<ReturnType<typeof getUndergradCurriculumCourses>>;
  postgradCourses: Awaited<ReturnType<typeof getPostgradCurriculumCourses>>;
  undergradCurriculum: curriculumDataT | [];
  postgradCurriculum: curriculumDataT | [];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const undergradCourses = await getUndergradCurriculumCourses(user.dep_id);
  const postgradCourses = await getPostgradCurriculumCourses(user.dep_id);
  const studiesCurriculum = await getStudiesCurriculum(user.dep_id);

  let undergradCurriculum: curriculumDataT = [];
  let postgradCurriculum: curriculumDataT = [];
  if (
    studiesCurriculum?.undergrad &&
    typeof studiesCurriculum?.undergrad === "object" &&
    Array.isArray(studiesCurriculum?.undergrad)
  ) {
    undergradCurriculum = studiesCurriculum.undergrad as curriculumDataT;
  }
  if (
    studiesCurriculum?.postgrad &&
    typeof studiesCurriculum?.postgrad === "object" &&
    Array.isArray(studiesCurriculum?.postgrad)
  ) {
    postgradCurriculum = studiesCurriculum.postgrad as curriculumDataT;
  }

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_studies_curriculum(path);
  return {
    breadcrumbData,
    undergradCourses,
    postgradCourses,
    undergradCurriculum,
    postgradCurriculum,
  };
};

const StudiesCurriculumPage = () => {
  const {
    breadcrumbData,
    undergradCourses,
    postgradCourses,
    undergradCurriculum,
    postgradCurriculum,
  } = useLoaderData() as LoaderDataT;

  return (
    <Page breadcrumbs={breadcrumbData} wide>
      <>
        <Curriculum
          title="Undergraduate curriculum"
          coursesData={undergradCourses}
          curriculumData={undergradCurriculum}
          variant={"undergradCurriculum"}
        />
        <Curriculum
          title="Postgraduate curriculum"
          coursesData={postgradCourses}
          curriculumData={postgradCurriculum}
          variant={"postgradCurriculum"}
        />
      </>
    </Page>
  );
};

export default StudiesCurriculumPage;
