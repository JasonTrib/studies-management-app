import type { FC } from "react";
import type { getProfessorUserShortExtended } from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import UsersTableItem from "./UsersTableItem";

type ProfessorsTableShortT = {
  data?: Awaited<ReturnType<typeof getProfessorUserShortExtended>>;
  usersType?: UserModelT["role"];
  openModal?: (profId: number) => void;
};

const ProfessorsTableShort: FC<ProfessorsTableShortT> = ({ data = [], openModal }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col />
        <col className="col-small" />
      </colgroup>
      <thead>
        <tr>
          <th>Professor</th>
          <th>Title</th>
          <th>Full name</th>
          <th></th>
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
            isPublic={x.profile?.is_public}
            title={x.professor.title}
            profId={x.professor.id}
            openModal={openModal}
          />
        ))}
      </tbody>
    </table>
  );
};

export default ProfessorsTableShort;
