import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/courses.css";
import Course from "./CoursesListItem";

type CoursesListContainerT = {
  data: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const CoursesListContainer: FC<CoursesListContainerT> = ({ data }) => {
  return (
    <div className="courses-list-container">
      <div className="heading">
        <h2>Courses</h2>
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
