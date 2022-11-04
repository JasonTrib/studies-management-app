import type { LinksFunction, LoaderFunction } from "@remix-run/node";
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
import { getStudiesCurriculum } from "~/DAO/studiesCurriculumDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import type { curriculumDataT, registrationPeriodT } from "~/data/data";
import { registrationPeriodScaffold, USER_ROLE } from "~/data/data";
import curriculumStyles from "~/styles/curriculum.css";
import tableStyles from "~/styles/table.css";
import { bc_studies } from "~/utils/breadcrumbs";
import { formatDate } from "~/utils/dateUtils";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import type { FormValidationT } from "~/validations/formValidation.server";
import type { registrationPeriodsSchema } from "~/validations/schemas/studiesCurriculumSchemas.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: curriculumStyles },
    { rel: "stylesheet", href: tableStyles },
  ];
};

type SchemaT = z.infer<typeof registrationPeriodsSchema>;

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_studies>>;
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
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

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
  const breadcrumbData = await bc_studies(path);
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

type ActionDataT = FormValidationT<SchemaT> | undefined;

const StudiesIndexPage = () => {
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
          <Form method="post" action={`edit`}>
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

export default StudiesIndexPage;
