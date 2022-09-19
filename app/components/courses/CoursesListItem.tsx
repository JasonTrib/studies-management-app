import { Link } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import GradIcon from "../icons/GradIcon";

type CoursesListItemT = {
  id: CourseModelT["id"];
  title: CourseModelT["title"];
  isPostgraduate: CourseModelT["is_postgraduate"];
  professors: {
    id: number;
    fullname: string;
  }[];
  semester: CourseModelT["semester"];
};

const CoursesListItem: FC<CoursesListItemT> = ({
  id,
  title,
  isPostgraduate,
  professors,
  semester,
}) => {
  return (
    <div className="container-item courses-list-item">
      <div className="title link">
        <Link to={`/courses/${id}`}>{title}</Link>
        {isPostgraduate && <GradIcon className="icon" width={20} height={20} />}
      </div>
      <div>
        {!!professors.length && (
          <span className="professors mr-12 link-simple">
            {professors.map((prof, i) => (
              <React.Fragment key={prof.id}>
                <Link to={`users/professors/${prof.id}`}>{prof.fullname}</Link>
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
