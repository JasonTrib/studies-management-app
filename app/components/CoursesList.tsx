import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesListItem from "./CoursesListItem";

type CoursesListT = {
  data?: (CourseModelT & { professors?: string[] })[];
};

const CoursesList: FC<CoursesListT> = ({ data }) => {
  data ??= [];

  return (
    <>
      {data.map((x) => (
        <CoursesListItem
          key={x.id}
          id={x.id}
          title={x.title}
          semester={x.semester}
          professors={x.professors || []}
        />
      ))}
    </>
  );
};

export default CoursesList;
