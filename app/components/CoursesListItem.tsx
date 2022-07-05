import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type CoursesListItemT = {
  id: CourseModelT["id"];
  title: CourseModelT["title"];
  semester: CourseModelT["semester"];
  professors: string[];
};

const CoursesListItem: FC<CoursesListItemT> = ({ id, title, semester, professors }) => {
  return (
    <div className="container-item courses-list-item">
      <div className="title link">
        <Link to={`/courses/${id}`}>{title}</Link>
      </div>
      <div>
        {!!professors.length && <span className="professors mr-12">{professors.join(" - ")}</span>}
        <span className="semester">semester: {semester}</span>
      </div>
    </div>
  );
};

export default CoursesListItem;
