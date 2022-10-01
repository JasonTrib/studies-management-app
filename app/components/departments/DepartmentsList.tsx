import type { FC } from "react";
import DepartmentsListItem from "~/components/departments/DepartmentsListItem";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";

type DepartmentsListT = {
  data?: (DepartmentModelT & {
    users: number;
    courses: number;
  })[];
};

const DepartmentsList: FC<DepartmentsListT> = ({ data = [] }) => {
  return (
    <>
      {data.map((x) => (
        <DepartmentsListItem
          key={x.code_id}
          codeId={x.code_id}
          title={x.title}
          users={x.users}
          courses={x.courses}
        />
      ))}
    </>
  );
};

export default DepartmentsList;
