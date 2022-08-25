import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesTableItem from "~/components/courses/CoursesTableItem";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";

type CoursesTableT = {
  data?: (CourseModelT & {
    isEnrolled?: boolean;
    isLecturing?: boolean;
    isFollowing: boolean;
    professors?: {
      id: number;
      fullname: string;
    }[];
  })[];
  userRole?: UserModelT["role"];
};

const CoursesTable: FC<CoursesTableT> = ({ data = [], userRole }) => {
  const isPriviledged = userRole === USER_ROLE.REGISTRAR || userRole === USER_ROLE.SUPERADMIN;

  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col className="col-small" />
        {!isPriviledged && (
          <>
            <col className="col-small" />
            <col className="col-small" />
          </>
        )}
      </colgroup>
      <thead>
        <tr>
          <th>Course</th>
          <th>Instructors</th>
          <th>Semester</th>
          {!isPriviledged && <th>Following</th>}
          {userRole === USER_ROLE.PROFESSOR && <th>Lecturing</th>}
          {userRole === USER_ROLE.STUDENT && <th>Enrolled</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <CoursesTableItem
            key={x.id}
            id={x.id}
            title={x.title}
            isPostgraduate={x.is_postgraduate}
            professors={x.professors || []}
            semester={x.semester}
            isFollowing={x.isFollowing}
            isLecturing={x.isLecturing}
            isEnrolled={x.isEnrolled}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CoursesTable;
