import type { FC } from "react";
import type { getRegistrarUsersExtended } from "~/DAO/composites/composites.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import UsersTableItem from "./UsersTableItem";

type RegistrarsTableT = {
  data?: Awaited<ReturnType<typeof getRegistrarUsersExtended>>;
  usersType?: UserModelT["role"];
};

const RegistrarsTable: FC<RegistrarsTableT> = ({ data = [] }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>User</th>
          <th>Full name</th>
          <th>Title</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <UsersTableItem
            key={x.id}
            username={x.username}
            regId={x.registrar.id}
            gender={x.profile?.gender}
            fullname={x.profile?.fullname}
            email={x.profile?.email}
            title={x.registrar.title}
            isCurrent={x.isCurrent}
          />
        ))}
      </tbody>
    </table>
  );
};

export default RegistrarsTable;
