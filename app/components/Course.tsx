import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/courses.css";
import { formatDate } from "~/utils/dateUtils";

type CourseT = {
  data: CourseModelT;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Course: FC<CourseT> = ({ data }) => {
  return (
    <div className="course-container">
      <div className="heading">
        <div className="title">{data.title}</div>
      </div>
      <div className="content">
        <div className="body">{data.description}</div>
        <div className="meta-data">
          <span className="course-level mr-12">
            {data.is_postgraduate ? "Postgraduate" : "Graduate"}
          </span>
          <span className="semester">semester: {data.semester}</span>
        </div>
      </div>
    </div>
  );
};

export default Course;
