import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { getMonth, getYear } from "date-fns";
import ActionButton from "~/components/buttons/ActionButton";
import Container from "~/components/Container";
import CourseRegistration from "~/components/CourseRegistration";
import Page from "~/components/layout/Page";
import { getStudentCoursesRegistration } from "~/DAO/composites/composites.server";
import { getProfile } from "~/DAO/profileDAO.server";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import { getStudentFromUserId } from "~/DAO/studentDAO.server";
import { getStudiesCurriculum } from "~/DAO/studiesCurriculumDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import type { curriculumDataT } from "~/data/data";
import { USER_ROLE } from "~/data/data";
import courseRegistrationStyles from "~/styles/course-registration.css";
import tableStyles from "~/styles/table.css";
import { bc_studies_registration } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";
import { getCurrentRegistration } from "~/utils/utils";

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
  coursesPool: Awaited<ReturnType<typeof getStudentCoursesRegistration>>;
  coursesDrafted: Awaited<ReturnType<typeof getStudentCoursesRegistration>>;
  courseIdsAvailable: number[];
  studentSemester: number;
  isPostgrad: boolean;
  diagnostic?: string;
  showButton: boolean;
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
    coursesPool: [],
    coursesDrafted: [],
    courseIdsAvailable: [],
    studentSemester: 0,
    isPostgrad: false,
    showButton: true,
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
    return json({
      ...returnScaffold,
      diagnostic: "Course registration is open for students only",
      showButton: false,
    });
  }

  const student = await getStudentFromUserId(user.id);
  if (!student) throw new Error();
  if (student.studies_status === "ALUM") {
    return json({ ...returnScaffold, diagnostic: "Cannot register to courses" });
  }
  if (student.latest_registration) {
    const latestRegistrationDate = new Date(student.latest_registration);
    if (
      getYear(latestRegistrationDate) === getYear(dateNow) &&
      ((getMonth(latestRegistrationDate) < 6 && getMonth(dateNow) < 6) ||
        (getMonth(latestRegistrationDate) >= 6 && getMonth(dateNow) >= 6))
    ) {
      return json({ ...returnScaffold, diagnostic: "Already registered to courses" });
    }
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

  const studentCourses = await getStudentCoursesRegistration(
    user.dep_id,
    student.id,
    studentSemester,
    isPostgrad,
  );

  studentCourses.forEach((x) => {
    coursesPerSemester[x.semester - 1].electives += 1;
    if (x.grade && x.grade >= 5) {
      coursesPerSemester[x.semester - 1].passed += 1;
    }
    if (x.isDrafted) {
      coursesPerSemester[x.semester - 1].drafted += 1;
    }
  });

  const coursesPool = studentCourses.filter((x) => !x.isDrafted && (!x.grade || x.grade < 5));
  const coursesDrafted = studentCourses.filter((x) => x.isDrafted);

  const courseIdsAvailable = coursesPool
    .map((course) =>
      curriculum[course.semester - 1].semester.electives >
      coursesPerSemester[course.semester - 1].passed +
        coursesPerSemester[course.semester - 1].drafted
        ? course.id
        : null,
    )
    .filter((x) => x) as number[];

  return json({
    ...returnScaffold,
    coursesPool,
    coursesDrafted,
    courseIdsAvailable,
    studentSemester,
    isPostgrad,
  });
};
const CourseRegistrationIndexPage = () => {
  const {
    breadcrumbData,
    coursesPool,
    coursesDrafted,
    courseIdsAvailable,
    studentSemester,
    isPostgrad,
    diagnostic,
    showButton,
  } = useLoaderData() as LoaderDataT;
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const hasNoOwedElectives = coursesDrafted.length === 0 && courseIdsAvailable.length === 0;
  const showRegisterButton = coursesDrafted.length > 0 || hasNoOwedElectives;
  const isDisabled = isBusy || (courseIdsAvailable.length > 0 && !hasNoOwedElectives);

  const MyCoursesButton = () => {
    return (
      <Link to="/my-courses">
        <ActionButton variant="cancel" size="custom">
          My courses
        </ActionButton>
      </Link>
    );
  };

  return (
    <Page breadcrumbs={breadcrumbData} wide>
      <>
        {diagnostic ? (
          <Container title={diagnostic} Button={showButton ? <MyCoursesButton /> : undefined} />
        ) : (
          <>
            {coursesPool.length > 0 && (
              <CourseRegistration
                variant="pool"
                title="Courses pool"
                courses={coursesPool}
                available={courseIdsAvailable}
              />
            )}
            {coursesDrafted.length > 0 && (
              <CourseRegistration
                variant="drafted"
                title="Drafted courses"
                courses={coursesDrafted}
                available={courseIdsAvailable}
              />
            )}
            {showRegisterButton && (
              <div className="draft-submit">
                <Form method="post" action={`edit`}>
                  <input type="hidden" id="_action" name="_action" value="register" />
                  <input
                    type="hidden"
                    id="coursesPool"
                    name="coursesPool"
                    value={JSON.stringify(coursesPool.map((course) => course.id))}
                  />
                  <input
                    type="hidden"
                    id="coursesToRegister"
                    name="coursesToRegister"
                    value={JSON.stringify(coursesDrafted.map((course) => course.id))}
                  />
                  <input
                    type="hidden"
                    id="studentSemester"
                    name="studentSemester"
                    value={studentSemester}
                  />
                  <input type="hidden" id="isPostgrad" name="isPostgrad" value={`${isPostgrad}`} />
                  <ActionButton variant="primary" type="submit" fullwidth disabled={isDisabled}>
                    REGISTER
                  </ActionButton>
                </Form>
              </div>
            )}
          </>
        )}
      </>
    </Page>
  );
};

export default CourseRegistrationIndexPage;
