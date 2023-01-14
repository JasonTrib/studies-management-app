import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { format } from "date-fns";
import _ from "lodash";
import type { z } from "zod";
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
import type { curriculumDataT, registrationPeriodT } from "~/data/data";
import { registrationPeriodScaffold, USER_ROLE } from "~/data/data";
import { isObject } from "~/utils/utils";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import { validateFormData } from "~/validations/formValidation.server";
import {
  postgradCurriculumSchema,
  registrationPeriodsSchema,
  undergradCurriculumSchema,
} from "~/validations/schemas/studiesCurriculumSchemas.server";

type Schema1T = z.infer<typeof undergradCurriculumSchema>;
type Schema2T = z.infer<typeof postgradCurriculumSchema>;
type Schema3T = z.infer<typeof registrationPeriodsSchema>;

export const action: ActionFunction = async ({ request, params }) => {
  if (request.method !== "PUT") throw new Response("Method Not Allowed", { status: 405 });
  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.REGISTRAR);

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
    if (isObject(studiesCurriculum.registration_periods)) {
      registrationPeriods = studiesCurriculum.registration_periods as registrationPeriodT;
    }

    const filterPastDate = (date: Date) => {
      if (format(date, "yyyy-MM-dd") >= format(new Date(), "yyyy-MM-dd")) {
        return date.toISOString();
      }
    };

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

  return redirect("/studies");
};
