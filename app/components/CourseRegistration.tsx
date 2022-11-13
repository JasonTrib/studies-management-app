import type { FC } from "react";
import type {
  getStudentCoursesForUndergradRegistration,
  getStudentCoursesForPostgradRegistration,
} from "~/DAO/composites/composites.server";

type CourseRegistrationT = {
  title?: string;
  courses: Awaited<
    ReturnType<
      | typeof getStudentCoursesForUndergradRegistration
      | typeof getStudentCoursesForPostgradRegistration
    >
  >;
};

const CourseRegistration: FC<CourseRegistrationT> = ({ title, courses }) => {
  return (
    <div className="course-registration-container">
      {title && (
        <div className="heading">
          <h3>{title}</h3>
          <div className="actions"></div>
        </div>
      )}
      <div className="content">
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
                    <button>X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
