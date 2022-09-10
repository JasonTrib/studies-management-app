import type { FC } from "react";
import type { getProfessorUsersExtended } from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import UsersTableItem from "./UsersTableItem";

type ProfessorsTableT = {
  data?: Awaited<ReturnType<typeof getProfessorUsersExtended>>;
  usersType?: UserModelT["role"];
};

const ProfessorsTable: FC<ProfessorsTableT> = ({ data = [] }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col className="col-small" />
      </colgroup>
      <thead>
        <tr>
          <th>User</th>
          <th>Title</th>
          <th>Full name</th>
          <th>Email</th>
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
            title={x.professor.title}
            courseNumber={x.professor.coursesNumber}
            isCurrent={x.isCurrent}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProfessorsTable;
