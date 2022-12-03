import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import ActionButton from "~/components/buttons/ActionButton";
import GradingTableItem from "~/components/grading/GradingTableItem";
import Page from "~/components/layout/Page";
import { getStudentsForGrading } from "~/DAO/composites/composites.server";
import { getCourse } from "~/DAO/courseDAO.server";
import { USER_ROLE } from "~/data/data";
import gradingStyles from "~/styles/grading.css";
import tableStyles from "~/styles/table.css";
import { bc_courses_id_grading } from "~/utils/breadcrumbs";
import { preventUnlessHasAccess } from "~/utils/permissionUtils.server";
import { logout, requireUser } from "~/utils/session.server";
import { getIsAlreadyGraded, getIsCourseGradingOpen, paramToInt } from "~/utils/utils";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: gradingStyles },
    { rel: "stylesheet", href: tableStyles },
  ];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_courses_id_grading>>;
  studentsGraded: Awaited<ReturnType<typeof getStudentsForGrading>>;
  studentsPendingGrading: Awaited<ReturnType<typeof getStudentsForGrading>>;
  isCourseGradingOpen: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courseId = paramToInt(params.courseId);
  if (courseId == null) throw new Response("Not Found", { status: 404 });

  const user = await requireUser(request);
  if (user === null) return logout(request);
  preventUnlessHasAccess(user.role, USER_ROLE.PROFESSOR);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_courses_id_grading(path);

  const returnScaffold = {
    breadcrumbData,
    isCourseGradingOpen: false,
  };

  const course = await getCourse(courseId);
  if (!course) throw new Response("Not Found", { status: 404 });

  const dateNow = new Date();
  const isCourseGradingOpen = getIsCourseGradingOpen(course.semester, dateNow);
  if (!isCourseGradingOpen) {
    return json({ ...returnScaffold });
  }

  const students = await getStudentsForGrading(courseId);

  const { studentsGraded, studentsPendingGrading } = students.reduce(
    (acc: { studentsGraded: typeof students; studentsPendingGrading: typeof students }, curr) => {
      if (getIsAlreadyGraded(dateNow, curr.latestGrading)) {
        return { ...acc, studentsGraded: [...acc.studentsGraded, curr] };
      } else if (!curr.grade || curr.grade < 5) {
        return { ...acc, studentsPendingGrading: [...acc.studentsPendingGrading, curr] };
      }
      return { ...acc };
    },
    { studentsGraded: [], studentsPendingGrading: [] },
  );

  return json({
    breadcrumbData,
    studentsGraded,
    studentsPendingGrading,
    isCourseGradingOpen: true,
  });
};

const GradingIndexPage = () => {
  const { breadcrumbData, studentsGraded, studentsPendingGrading, isCourseGradingOpen } =
    useLoaderData() as LoaderDataT;
  const fetcher = useFetcher();
  const isBusy = fetcher.state !== "idle";

  return (
    <Page wide breadcrumbs={breadcrumbData}>
      <>
        <div className="grading-container">
          <fetcher.Form method="post" action={`edit`}>
            <div className="content">
              <div className="body">
                <table>
                  <colgroup>
                    <col />
                    <col />
                    <col />
                    <col className="col-small" />
                    <col className="col-small" />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Full name</th>
                      <th>Email</th>
                      <th>Enrollment year</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <GradingTableItem students={studentsGraded} graded isBusy={isBusy} />
                    <GradingTableItem students={studentsPendingGrading} isBusy={isBusy} />
                  </tbody>
                </table>
              </div>
              {isCourseGradingOpen && studentsPendingGrading.length > 0 && (
                <div className="form-submit">
                  <ActionButton type="submit" disabled={isBusy} variant="primary" fullwidth>
                    SUBMIT
                  </ActionButton>
                </div>
              )}
            </div>
          </fetcher.Form>
        </div>
      </>
    </Page>
  );
};

export default GradingIndexPage;
