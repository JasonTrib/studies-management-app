import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesListItem from "~/components/courses/CoursesListItem";

type CoursesListT = {
  data?: (CourseModelT & {
    professors?: {
      id: number;
      name: string;
      surname: string;
    }[];
  })[];
};

const CoursesList: FC<CoursesListT> = ({ data = [] }) => {
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
