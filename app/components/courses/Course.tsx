import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/courses.css";

type CourseT = {
  data: CourseModelT & {
    students_registered: number;
    students_following: number;
    professors: {
      id: number;
      name: string;
      surname: string;
    }[];
  };
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
        <div className="footer">
          <div className="data vertical-space">
            <div>
              {"Instructors: "}
              {data.professors.map((prof, i) => (
                <React.Fragment key={prof.id}>
                  <span className="instructor link-simple">
                    <Link to={`/professors/${prof.id}`}>
                      {prof.name} {prof.surname}
                    </Link>
                  </span>
                  {i < data.professors.length - 1 && " - "}
                </React.Fragment>
              ))}
            </div>
            <div>
              <span className="mr-12">
                {data.is_postgraduate ? "Postgraduate" : "Undergraduate"}
              </span>
              <span className="semester">semester: {data.semester}</span>
            </div>
          </div>
          <div className="meta-data vertical-space">
            <div>registered: {data.students_registered}</div>
            <div>following: {data.students_following}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
