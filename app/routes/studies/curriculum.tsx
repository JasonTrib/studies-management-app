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
import type { UserModelT } from "~/DAO/userDAO.server";
import type { curriculumDataT } from "~/data/data";
import { USER_ROLE } from "~/data/data";
import styles from "~/styles/curriculum.css";
import tableStyles from "~/styles/table.css";
import { bc_studies_curriculum } from "~/utils/breadcrumbs";
import { throwUnlessHasAccess } from "~/utils/permissionUtils.server";
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
  throwUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "undergradCurriculum") {
    const form = validateFormData<SchemaT>(body, undergradCurriculumSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const undergradCourses = await getUndergradCurriculumCourses(user.dep_id);
    const electivesAvailable = undergradCourses.map((x) => x.semester.electives);

    const formDataArray = [
      form.data.sem1,
      form.data.sem2,
      form.data.sem3,
      form.data.sem4,
      form.data.sem5,
      form.data.sem6,
      form.data.sem7,
      form.data.sem8,
    ].map((x) => parseInt(x));

    if (electivesAvailable.some((electives, i) => formDataArray[i] > electives))
      throw new Response("Bad Request", { status: 400 });

    const curriculumData: curriculumDataT = formDataArray.map((x) => ({
      semester: { electives: x },
    }));

    await updateUndergradStudiesCurriculum(user.dep_id, curriculumData);
  }
  if (body["_action"] === "postgradCurriculum") {
    const form = validateFormData<SchemaT>(body, postgradCurriculumSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const postgradCourses = await getPostgradCurriculumCourses(user.dep_id);
    const electivesAvailable = postgradCourses.map((x) => x.semester.electives);

    const formDataArray = [form.data.sem1, form.data.sem2, form.data.sem3, form.data.sem4].map(
      (x) => parseInt(x),
    );

    if (electivesAvailable.some((electives, i) => formDataArray[i] > electives))
      throw new Response("Bad Request", { status: 400 });

    const curriculumData: curriculumDataT = formDataArray.map((x) => ({
      semester: { electives: x },
    }));

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
  userRole: UserModelT["role"];
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
    userRole: user.role,
  };
};

const StudiesCurriculumPage = () => {
  const {
    breadcrumbData,
    undergradCourses,
    postgradCourses,
    undergradCurriculum,
    postgradCurriculum,
    userRole,
  } = useLoaderData() as LoaderDataT;
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;

  return (
    <Page breadcrumbs={breadcrumbData} wide>
      <>
        <Curriculum
          title="Undergraduate curriculum"
          coursesData={undergradCourses}
          curriculumData={undergradCurriculum}
          variant={"undergradCurriculum"}
          showAction={isPriviledged}
        />
        <Curriculum
          title="Postgraduate curriculum"
          coursesData={postgradCourses}
          curriculumData={postgradCurriculum}
          variant={"postgradCurriculum"}
          showAction={isPriviledged}
        />
      </>
    </Page>
  );
};

export default StudiesCurriculumPage;
