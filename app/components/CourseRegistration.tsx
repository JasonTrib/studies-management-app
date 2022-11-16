import { Link, useTransition } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import type { getStudentCoursesRegistration } from "~/DAO/composites/composites.server";
import RegistrationAction from "./RegistrationAction";

type CourseForRegistrationT = Awaited<ReturnType<typeof getStudentCoursesRegistration>>;

type CourseRegistrationT = {
  variant: "pool" | "drafted";
  title?: string;
  courses: CourseForRegistrationT;
  available: number[];
};

const CourseRegistration: FC<CourseRegistrationT> = ({ variant, title, courses, available }) => {
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
                  <th>Title</th>
                  <th>Instructors</th>
                  <th>Semester</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="text-start">{course.title}</td>
                    <td className="instructors text-start">
                      {course.professors.length > 0 && (
                        <span className="link-simple">
                          {course.professors.map((prof, i) => (
                            <React.Fragment key={prof.id}>
                              <Link to={`/users/professors/${prof.id}`}>{prof.fullname}</Link>
                              {i < course.professors.length - 1 && " - "}
                            </React.Fragment>
                          ))}
                        </span>
                      )}
                    </td>
                    <td className="semester">{course.semester}</td>
                    <td className="action-cell">
                      {(variant === "drafted" || available.find((x) => x === course.id)) && (
                        <RegistrationAction
                          courseId={course.id}
                          isDisabled={isBusy}
                          action={variant === "pool" ? "draft" : "undraft"}
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
