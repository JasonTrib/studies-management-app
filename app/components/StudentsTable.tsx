import type { FC } from "react";
import type { getStudentUsersExtended } from "~/DAO/composites/composites.server";
import StudentsTableItem from "./StudentsTableItem";

type StudentsTableT = {
  data?: Awaited<ReturnType<typeof getStudentUsersExtended>>;
  noResults?: string;
};

const StudentsTable: FC<StudentsTableT> = ({ data = [], noResults }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col />
        <col className="col-small" />
        <col className="col-medium" />
        <col className="col-small" />
      </colgroup>
      <thead>
        <tr>
          <th>User</th>
          <th>Full name</th>
          <th>Email</th>
          <th>Enrollment year</th>
          <th>Studies status</th>
          <th>Courses</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <StudentsTableItem
            key={x.id}
            username={x.username}
            studentId={x.student.id}
            gender={x.profile?.gender}
            fullname={x.profile?.fullname}
            email={x.profile?.email}
            enrollmentYear={x.student.enrollment_year}
            studiesStatus={x.student.studies_status}
            courseNumber={x.student.coursesNumber}
            isCurrent={x.isCurrent}
          />
        ))}
      </tbody>
    </table>
  );
};

export default StudentsTable;
