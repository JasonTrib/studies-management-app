import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesTableItem from "./CoursesTableItem";

type MyCoursesTableT = {
  data?: (CourseModelT & {
    professors: {
      id: number;
      fullname: string;
    }[];
    student: {
      grade: number;
      isEnrolled: boolean;
      isFollowing: boolean;
    };
  })[];
};

const MyCoursesTable: FC<MyCoursesTableT> = ({ data = [] }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col className="col-small" />
        <col className="col-small" />
      </colgroup>
      <thead>
        <tr>
          <th>Course</th>
          <th>Instructors</th>
          <th>Semester</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <CoursesTableItem
            key={x.id}
            id={x.id}
            title={x.title}
            semester={x.semester}
            professors={x.professors}
            grade={x.student.grade}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MyCoursesTable;
