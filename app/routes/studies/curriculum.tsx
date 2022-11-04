import type { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import { format, getMonth, getYear } from "date-fns";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import type { z } from "zod";
import ActionButton from "~/components/buttons/ActionButton";
import Curriculum from "~/components/Curriculum";
import FormDatePicker from "~/components/form/FormDatePicker";
import CogIcon from "~/components/icons/CogIcon";
import Page from "~/components/layout/Page";
import {
  getPostgradCurriculumCourses,
  getUndergradCurriculumCourses,
} from "~/DAO/composites/composites.server";
import {
  getStudiesCurriculum,
  updatePostgradStudiesCurriculum,
  updateRegistrationPeriod,
  updateUndergradStudiesCurriculum,
} from "~/DAO/studiesCurriculumDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import type { curriculumDataT, registrationPeriodT } from "~/data/data";
import { registrationPeriodScaffold, USER_ROLE } from "~/data/data";
import curriculumStyles from "~/styles/curriculum.css";
import tableStyles from "~/styles/table.css";
import { bc_studies_curriculum } from "~/utils/breadcrumbs";
import { formatDate } from "~/utils/dateUtils";
import { throwUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import { validateFormData } from "~/validations/formValidation.server";
import {
  postgradCurriculumSchema,
  registrationPeriodsSchema,
  undergradCurriculumSchema,
} from "~/validations/schemas/studiesCurriculumSchemas.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: curriculumStyles },
    { rel: "stylesheet", href: tableStyles },
  ];
};

type Schema1T = z.infer<typeof undergradCurriculumSchema>;
type Schema2T = z.infer<typeof postgradCurriculumSchema>;
type Schema3T = z.infer<typeof registrationPeriodsSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);
  throwUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

  const formData = await request.formData();
  const body = Object.fromEntries(formData);

  if (body["_action"] === "undergradCurriculum") {
    const form = validateFormData<Schema1T>(body, undergradCurriculumSchema);
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
    const form = validateFormData<Schema2T>(body, postgradCurriculumSchema);
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
  if (body["_action"] === "registrationPeriod") {
    const bodyData = {
      fallSemesterStart: new Date(`${body.fallSemesterStart}`),
      fallSemesterEnd: new Date(`${body.fallSemesterEnd}`),
      springSemesterStart: new Date(`${body.springSemesterStart}`),
      springSemesterEnd: new Date(`${body.springSemesterEnd}`),
    };

    const form = validateFormData<Schema3T>(bodyData, registrationPeriodsSchema);
    if (!_.isEmpty(form.errors) || form.data === null) {
      return json(form, { status: 400 });
    }

    const studiesCurriculum = await getStudiesCurriculum(user.dep_id);
    if (!studiesCurriculum) throw new Error();

    let registrationPeriods = registrationPeriodScaffold;
    if (
      studiesCurriculum.registration_periods &&
      typeof studiesCurriculum.registration_periods === "object" &&
      !Array.isArray(studiesCurriculum.registration_periods) &&
      studiesCurriculum.registration_periods !== null
    ) {
      registrationPeriods = studiesCurriculum.registration_periods as registrationPeriodT;
    }

    const filterPastDate = (date: Date) =>
      date.getTime() >= Date.now() ? date.toISOString() : undefined;

    const fallSemesterStart =
      filterPastDate(form.data.fallSemesterStart) || registrationPeriods.fallSemester.startDate;
    const fallSemesterEnd =
      filterPastDate(form.data.fallSemesterEnd) || registrationPeriods.fallSemester.endDate;
    const springSemesterStart =
      filterPastDate(form.data.springSemesterStart) || registrationPeriods.springSemester.startDate;
    const springSemesterEnd =
      filterPastDate(form.data.springSemesterEnd) || registrationPeriods.springSemester.startDate;

    const registrationData: registrationPeriodT = {
      fallSemester: {
        startDate: fallSemesterStart,
        endDate: fallSemesterEnd,
      },
      springSemester: {
        startDate: springSemesterStart,
        endDate: springSemesterEnd,
      },
    };

    await updateRegistrationPeriod(user.dep_id, registrationData);
  }

  return null;
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_studies_curriculum>>;
  undergradCourses: Awaited<ReturnType<typeof getUndergradCurriculumCourses>>;
  postgradCourses: Awaited<ReturnType<typeof getPostgradCurriculumCourses>>;
  undergradCurriculum: curriculumDataT | [];
  postgradCurriculum: curriculumDataT | [];
  registrationPeriods: registrationPeriodT;
  userRole: UserModelT["role"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const undergradCourses = await getUndergradCurriculumCourses(user.dep_id);
  const postgradCourses = await getPostgradCurriculumCourses(user.dep_id);
  const studiesCurriculum = await getStudiesCurriculum(user.dep_id);

  let registrationPeriods = registrationPeriodScaffold;
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
  if (
    studiesCurriculum?.registration_periods &&
    typeof studiesCurriculum?.registration_periods === "object" &&
    !Array.isArray(studiesCurriculum?.registration_periods) &&
    studiesCurriculum?.registration_periods !== null
  ) {
    registrationPeriods = studiesCurriculum?.registration_periods as registrationPeriodT;
  }

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_studies_curriculum(path);
  return {
    breadcrumbData,
    undergradCourses,
    postgradCourses,
    undergradCurriculum,
    postgradCurriculum,
    registrationPeriods,
    userRole: user.role,
  };
};

type ActionDataT = FormValidationT<Schema3T> | undefined;

const StudiesCurriculumPage = () => {
  const {
    breadcrumbData,
    undergradCourses,
    postgradCourses,
    undergradCurriculum,
    postgradCurriculum,
    registrationPeriods,
    userRole,
  } = useLoaderData() as LoaderDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const actionData = useActionData() as ActionDataT;
  const [isEditing, setIsEditing] = useState(false);
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (transition.state === "loading") {
      hasLoaded.current = true;
    }
    if (hasLoaded && transition.state === "idle") {
      hasLoaded.current = false;
      if (!actionData?.errors) {
        setIsEditing(false);
      }
    }
  }, [transition.state, actionData?.errors]);

  const evaluateDate = (dateIso?: string) => {
    return dateIso ? formatDate(new Date(dateIso)) : "(Date not set)";
  };
  const dateToDateInputValid = (dateIso?: string) => {
    return dateIso ? format(new Date(dateIso), "yyyy-MM-dd") : undefined;
  };

  const formattedDates = {
    fallStart: dateToDateInputValid(registrationPeriods.fallSemester.startDate),
    fallEnd: dateToDateInputValid(registrationPeriods.fallSemester.endDate),
    springStart: dateToDateInputValid(registrationPeriods.springSemester.startDate),
    springEnd: dateToDateInputValid(registrationPeriods.springSemester.endDate),
    now: dateToDateInputValid(new Date().toISOString()),
  };

  let earliestValidDate;
  let latestValidDate;
  if (getMonth(new Date()) < 5) {
    earliestValidDate = _.max([`${getYear(new Date())}-02-01`, formattedDates.now]);
    latestValidDate = `${getYear(new Date())}-05-31`;
  } else {
    earliestValidDate = _.max([`${getYear(new Date()) + 1}-02-01`, formattedDates.now]);
    latestValidDate = `${getYear(new Date()) + 1}-05-31`;
  }

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
        <div className="registration-periods-container">
          <Form method="post" action={`/studies/curriculum`}>
            <div className="heading">
              <h3>Registration periods</h3>
              <div className="actions">
                {isEditing ? (
                  <>
                    <ActionButton
                      className="action-btn"
                      disabled={isBusy}
                      variant="primary"
                      type="submit"
                    >
                      SUBMIT
                    </ActionButton>
                    <ActionButton
                      className="action-btn"
                      onClick={() => setIsEditing(false)}
                      variant="cancel"
                    >
                      CANCEL
                    </ActionButton>
                    <input type="hidden" id="_action" name="_action" value={"registrationPeriod"} />
                  </>
                ) : (
                  <div className="svg-btn" onClick={() => setIsEditing(true)}>
                    <CogIcon />
                  </div>
                )}
              </div>
            </div>
            <div className="content">
              <div className="body">
                <div className="label">Fall semester</div>
                <div className="registration-period">
                  {isEditing ? (
                    <>
                      <div className="registration-date-edit">
                        <FormDatePicker
                          label="fallSemesterStart"
                          min={_.max([`${getYear(new Date())}-09-01`, formattedDates.now])}
                          max={`${getYear(new Date())}-12-31`}
                          defaultValue={formattedDates.fallStart}
                          disabled={isBusy}
                          error={actionData?.errors?.fallSemesterStart}
                        />
                      </div>
                      <div className="date-separator">-</div>
                      <div className="registration-date-edit">
                        <FormDatePicker
                          label="fallSemesterEnd"
                          min={_.max([`${getYear(new Date())}-09-01`, formattedDates.now])}
                          max={`${getYear(new Date())}-12-31`}
                          defaultValue={formattedDates.fallEnd}
                          disabled={isBusy}
                          error={actionData?.errors?.fallSemesterEnd}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="registration-date">
                        {evaluateDate(registrationPeriods.fallSemester.startDate)}
                      </div>
                      <div className="date-separator">-</div>
                      <div className="registration-date end-date">
                        {evaluateDate(registrationPeriods.fallSemester.endDate)}
                      </div>
                    </>
                  )}
                </div>
                <div className="label">Spring semester</div>
                <div className="registration-period">
                  {isEditing ? (
                    <>
                      <div className="registration-date-edit">
                        <FormDatePicker
                          label="springSemesterStart"
                          min={earliestValidDate}
                          max={latestValidDate}
                          defaultValue={formattedDates.springStart}
                          disabled={isBusy}
                          error={actionData?.errors?.springSemesterStart}
                        />
                      </div>
                      <div className="date-separator">-</div>
                      <div className="registration-date-edit">
                        <FormDatePicker
                          label="springSemesterEnd"
                          min={earliestValidDate}
                          max={latestValidDate}
                          defaultValue={formattedDates.springEnd}
                          disabled={isBusy}
                          error={actionData?.errors?.springSemesterEnd}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="registration-date">
                        {evaluateDate(registrationPeriods.springSemester.startDate)}
                      </div>
                      <div className="date-separator">-</div>
                      <div className="registration-date end-date">
                        {evaluateDate(registrationPeriods.springSemester.endDate)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </>
    </Page>
  );
};

export default StudiesCurriculumPage;
