import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";

type DepartmentsListItemT = {
  codeId: DepartmentModelT["code_id"];
  title: DepartmentModelT["title"];
  users: number;
  courses: number;
};

const DepartmentsListItem: FC<DepartmentsListItemT> = ({ codeId, title, users, courses }) => {
  return (
    <div className="container-item departments-list-item">
      <div className="title link">
        <Link to={`/departments/${codeId}`}>{title}</Link>
      </div>
      <div className="stats">
        <span>courses: {courses}</span>
        <span className="bar-separator">|</span>
        <span>users: {users}</span>
      </div>
    </div>
  );
};

export default DepartmentsListItem;
