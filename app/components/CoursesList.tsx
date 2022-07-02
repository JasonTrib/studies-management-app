import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesListItem from "./CoursesListItem";

type CoursesListT = {
  data?: CourseModelT[];
};

const CoursesList: FC<CoursesListT> = ({ data }) => {
  data ??= [];

  return (
    <>
      {data.map((x) => (
        <CoursesListItem key={x.id} id={x.id} title={x.title} description={x.description} />
      ))}
    </>
  );
};

export default CoursesList;
