import type { FC } from "react";
import type { getStudentUsersExtended } from "~/DAO/composites/composites.server";
import UsersTableItem from "./UsersTableItem";

type StudentsTableT = {
  data?: Awaited<ReturnType<typeof getStudentUsersExtended>>;
};

const StudentsTable: FC<StudentsTableT> = ({ data = [] }) => {
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
          <UsersTableItem
            key={x.id}
            userId={x.id}
            username={x.username}
            gender={x.profile?.gender}
            fullname={x.profile?.fullname}
            email={x.profile?.email}
            isPublic={x.profile.is_public}
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
