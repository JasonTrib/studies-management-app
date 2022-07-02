import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type CoursesListItemT = {
  id: CourseModelT["id"];
  title: CourseModelT["title"];
  description: CourseModelT["description"];
};

const CoursesListItem: FC<CoursesListItemT> = ({ id, title, description }) => {
  const professors = ["Berry Klein", "Ritta Goensberg"];
  const semester = "6";

  return (
    <div className="container-item courses-list-item">
      <div className="title link">
        <Link to={`/courses/${id}`}>{title}</Link>
      </div>
      <div>
        <span className="professors mr-12">{professors.join(" - ")}</span>
        <span className="semester">semester: {semester}</span>
      </div>
    </div>
  );
};

export default CoursesListItem;
