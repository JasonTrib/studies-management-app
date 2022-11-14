import { useTransition } from "@remix-run/react";
import type { FC } from "react";
import type {
  getStudentCoursesForPostgradRegistration,
  getStudentCoursesForUndergradRegistration,
} from "~/DAO/composites/composites.server";
import RegistrationAction from "./RegistrationAction";

type CourseRegistrationT = {
  title?: string;
  courses: Awaited<
    ReturnType<
      | typeof getStudentCoursesForUndergradRegistration
      | typeof getStudentCoursesForPostgradRegistration
    >
  >;
  available: number[];
  variant: "pool" | "drafted";
};

const CourseRegistration: FC<CourseRegistrationT> = ({ title, courses, available, variant }) => {
  const transition = useTransition();
  const isBusy = transition.state !== "idle";

  return (
    <div className="course-registration-container">
      {title && (
        <div className="heading">
          <h3>{title}</h3>
          <div className="actions"></div>
        </div>
      )}
      <div className="content">
        {courses.length > 0 && (
          <div className="body">
            <table>
              <colgroup>
                <col />
                <col />
                <col className="col-small" />
                <col className="col-small" />
              </colgroup>
              <thead>
                <tr>
                  <th className="text-start">Title</th>
                  <th className="text-start">Instructors</th>
                  <th className="text-start">Semester</th>
                  <th className="text-start"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="text-start">{course.title}</td>
                    <td className="text-start">{course.professors.map((prof) => prof.fullname)}</td>
                    <td>{course.semester}</td>
                    <td>
                      {(variant === "drafted" || available.find((x) => x === course.id)) && (
                        <RegistrationAction
                          courseId={course.id}
                          isDisabled={isBusy}
                          variant={variant === "pool" ? "draft" : "undraft"}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseRegistration;
