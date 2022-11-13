import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { addDays, format, getMonth, getYear } from "date-fns";
import CourseRegistration from "~/components/CourseRegistration";
import Page from "~/components/layout/Page";
import {
  getStudentCoursesForPostgradRegistration,
  getStudentCoursesForUndergradRegistration,
} from "~/DAO/composites/composites.server";
import { getProfile } from "~/DAO/profileDAO.server";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import { getStudentFromUserId } from "~/DAO/studentDAO.server";
import type { StudiesCurriculumModelT } from "~/DAO/studiesCurriculumDAO.server";
import { getStudiesCurriculum } from "~/DAO/studiesCurriculumDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import type { curriculumDataT, registrationPeriodT } from "~/data/data";
import { registrationPeriodScaffold, USER_ROLE } from "~/data/data";
import courseRegistrationStyles from "~/styles/course-registration.css";
import tableStyles from "~/styles/table.css";
import { bc_studies_registration } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import { isObject } from "~/utils/utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: courseRegistrationStyles },
    { rel: "stylesheet", href: tableStyles },
  ];
};

const coursesPerSemester = [
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
  { electives: 0, passed: 0, drafted: 0 },
];

const getCurrentRegistration = (
  studiesCurriculum: StudiesCurriculumModelT | null,
  dateNow: Date,
) => {
  let registrationPeriods = registrationPeriodScaffold;
  if (isObject(studiesCurriculum?.registration_periods)) {
    registrationPeriods = studiesCurriculum?.registration_periods as registrationPeriodT;
  }
  const dateStringNow = dateNow.toISOString();

  const isFallRegistration =
    format(new Date(registrationPeriods.fallSemester.startDate), "yyyy-MM-dd") < dateStringNow &&
    dateStringNow <
      format(addDays(new Date(registrationPeriods.fallSemester.endDate), 1), "yyyy-MM-dd");
  const isSpringRegistration =
    format(new Date(registrationPeriods.springSemester.startDate), "yyyy-MM-dd") < dateStringNow &&
    dateStringNow <
      format(addDays(new Date(registrationPeriods.springSemester.endDate), 1), "yyyy-MM-dd");

  return { isFallRegistration, isSpringRegistration };
};

const calcStudentSemester = (enrollmentYear: StudentModelT["enrollment_year"], dateNow: Date) => {
  if (
    getYear(dateNow) < enrollmentYear ||
    (enrollmentYear === getYear(dateNow) && getMonth(dateNow) < 8)
  ) {
    return { studentSemester: 0, diagnostic: "Cannot yet register to courses" };
  } else {
    const yearDiff = getYear(dateNow) - enrollmentYear;
    if (getMonth(dateNow) >= 8) {
      return { studentSemester: yearDiff * 2 + 1 };
    } else {
      return { studentSemester: yearDiff * 2 };
    }
  }
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_studies_registration>>;
  userRole: UserModelT["role"];
  coursesAvailable: Awaited<ReturnType<typeof getStudentCoursesForUndergradRegistration>>;
  coursesDrafted: Awaited<ReturnType<typeof getStudentCoursesForUndergradRegistration>>;
  diagnostic?: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const profile = await getProfile(user.id);
  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_studies_registration(path);

  const returnScaffold = {
    breadcrumbData,
    userInfo: {
      username: user.username,
      role: user.role,
      fullname: profile?.fullname,
      gender: profile?.gender,
    },
    coursesAvailable: [],
    coursesDrafted: [],
  };

  const dateNow = new Date();
  const studiesCurriculum = await getStudiesCurriculum(user.dep_id);
  const { isFallRegistration, isSpringRegistration } = getCurrentRegistration(
    studiesCurriculum,
    dateNow,
  );
  const isRegistrationPeriod = isFallRegistration || isSpringRegistration;

  if (!isRegistrationPeriod) {
    return json({ ...returnScaffold, diagnostic: "Course registration is closed" });
  } else if (user.role !== USER_ROLE.STUDENT) {
    return json({ ...returnScaffold, diagnostic: "Course registration is open for students" });
  }

  const student = await getStudentFromUserId(user.id);
  if (!student) throw new Error();
  if (student.studies_status === "ALUM") {
    return json({ ...returnScaffold, diagnostic: "Cannot register to courses" });
  }
  const isUndergrad = student.studies_status === "UNDERGRADUATE";
  const isPostgrad = student.studies_status === "POSTGRADUATE";

  let curriculum: curriculumDataT = [];
  if (isUndergrad) {
    if (studiesCurriculum && Array.isArray(studiesCurriculum.undergrad)) {
      curriculum = studiesCurriculum.undergrad as curriculumDataT;
    }
  }
  if (isPostgrad) {
    if (studiesCurriculum && Array.isArray(studiesCurriculum.postgrad)) {
      curriculum = studiesCurriculum.postgrad as curriculumDataT;
    }
  }

  const { studentSemester, diagnostic } = calcStudentSemester(student.enrollment_year, dateNow);
  if (diagnostic) {
    return json({ ...returnScaffold, diagnostic });
  }

  let studentCourses: Awaited<ReturnType<typeof getStudentCoursesForUndergradRegistration>> = [];
  if (isUndergrad) {
    studentCourses = await getStudentCoursesForUndergradRegistration(
      user.dep_id,
      student.id,
      studentSemester,
    );
  } else if (isPostgrad) {
    studentCourses = await getStudentCoursesForPostgradRegistration(
      user.dep_id,
      student.id,
      studentSemester,
    );
  }

  studentCourses.forEach((x) => {
    coursesPerSemester[x.semester - 1].electives += 1;
    if (x.grade && x.grade >= 5) {
      coursesPerSemester[x.semester - 1].passed += 1;
    }
    if (x.isDrafted) {
      coursesPerSemester[x.semester - 1].drafted += 1;
    }
  });

  const coursesDrafted = studentCourses.filter((x) => x.isDrafted);
  let coursesAvailable: Awaited<ReturnType<typeof getStudentCoursesForUndergradRegistration>> = [];

  const coursesAvailableCandidates = studentCourses.filter((x) => !x.isDrafted);
  coursesAvailable = coursesAvailableCandidates.filter((course) =>
    curriculum[course.semester - 1].semester.electives >
    coursesPerSemester[course.semester - 1].passed + coursesPerSemester[course.semester - 1].drafted
      ? true
      : false,
  );

  return json({ ...returnScaffold, coursesAvailable, coursesDrafted });
};
const CourseRegistrationIndexPage = () => {
  const { breadcrumbData, coursesAvailable, coursesDrafted, diagnostic } =
    useLoaderData() as LoaderDataT;

  return (
    <Page breadcrumbs={breadcrumbData} wide>
      <>
        <CourseRegistration title="Available courses" courses={coursesAvailable} />
        <CourseRegistration title="Drafted courses" courses={coursesDrafted} />
      </>
    </Page>
  );
};

export default CourseRegistrationIndexPage;