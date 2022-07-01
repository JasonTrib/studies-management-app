import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/courses.css";
import Course from "./CoursesListItem";

type CoursesListContainerT = {
  title?: string;
  data: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const CoursesListContainer: FC<CoursesListContainerT> = ({ title, data }) => {
  return (
    <div className="courses-list-container">
      <div className={`${title ? "heading" : "no-heading"}`}>
        <h2>{title}</h2>
      </div>
      <div className="content">
        {data.map((x) => (
          <Course key={x.id} id={x.id} title={x.title} description={x.description} />
        ))}
      </div>
    </div>
  );
};

export default CoursesListContainer;
