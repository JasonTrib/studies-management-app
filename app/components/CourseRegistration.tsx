import { Form, Link, useTransition } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import type { getStudentCoursesRegistration } from "~/DAO/composites/composites.server";
import ActionButton from "./buttons/ActionButton";
import RegistrationAction from "./RegistrationAction";

type CourseForRegistrationT = Awaited<ReturnType<typeof getStudentCoursesRegistration>>;

type CourseRegistrationT = {
  variant: "pool" | "drafted";
  title?: string;
  coursesPool: CourseForRegistrationT;
  coursesDrafted: CourseForRegistrationT;
  available: number[];
  semester: number;
  isPostgrad: boolean;
};

const CourseRegistration: FC<CourseRegistrationT> = ({
  variant,
  title,
  coursesPool,
  coursesDrafted,
  available,
  semester,
  isPostgrad,
}) => {
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const isDisabled = !!available.length || isBusy;
  const courses = variant === "pool" ? coursesPool : coursesDrafted;

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
          <>
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
            {variant === "drafted" && (
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
                    value={semester}
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
      </div>
    </div>
  );
};

export default CourseRegistration;
