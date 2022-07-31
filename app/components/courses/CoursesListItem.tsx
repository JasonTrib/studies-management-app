import { Link } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type CoursesListItemT = {
  id: CourseModelT["id"];
  title: CourseModelT["title"];
  semester: CourseModelT["semester"];
  professors: {
    id: number;
    fullname: string;
  }[];
};

const CoursesListItem: FC<CoursesListItemT> = ({ id, title, semester, professors }) => {
  return (
    <div className="container-item courses-list-item">
      <div className="title link">
        <Link to={`/courses/${id}`}>{title}</Link>
      </div>
      <div>
        {!!professors.length && (
          <span className="professors mr-12 link-simple">
            {professors.map((prof, i) => (
              <React.Fragment key={prof.id}>
                <Link to={`/professors/${prof.id}`}>{prof.fullname}</Link>
                {i < professors.length - 1 && " - "}
              </React.Fragment>
            ))}
          </span>
        )}
        <span className="semester">semester: {semester}</span>
      </div>
    </div>
  );
};

export default CoursesListItem;
