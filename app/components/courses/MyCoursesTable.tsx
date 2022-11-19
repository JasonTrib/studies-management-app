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
  showHasPassed?: boolean;
};

const MyCoursesTable: FC<MyCoursesTableT> = ({ data = [], userRole, showHasPassed }) => {
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
          <th>Title</th>
          <th>Instructors</th>
          <th>Semester</th>
          {userRole === USER_ROLE.STUDENT && <th>Grade</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <CoursesTableItem
            key={x.id}
            courseId={x.id}
            title={x.title}
            isPostgraduate={x.is_postgraduate}
            professors={x.professors}
            semester={x.semester}
            grade={x.grade}
            showHasPassed={showHasPassed}
            hasPassed={!!x.grade && x.grade >= 5}
          />
        ))}
      </tbody>
    </table>
  );
};

export default MyCoursesTable;
