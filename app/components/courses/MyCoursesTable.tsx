import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import CoursesTableItem from "./CoursesTableItem";

type MyCoursesTableT = {
  data?: (CourseModelT & {
    professors: {
      id: number;
      fullname: string;
    }[];
    grade?: number;
    isEnrolled?: boolean;
    isLecturing?: boolean;
    isFollowing: boolean;
  })[];
  userRole?: UserModelT["role"];
};

const MyCoursesTable: FC<MyCoursesTableT> = ({ data = [], userRole }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col className="col-small" />
        {userRole === USER_ROLE.STUDENT && <col className="col-small" />}
      </colgroup>
      <thead>
        <tr>
          <th>Course</th>
          <th>Instructors</th>
          <th>Semester</th>
          {userRole === USER_ROLE.STUDENT && <th>Grade</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <CoursesTableItem
            key={x.id}
            id={x.id}
            title={x.title}
            isPostgraduate={x.is_postgraduate}
            professors={x.professors}
            semester={x.semester}
            grade={x.grade}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MyCoursesTable;
