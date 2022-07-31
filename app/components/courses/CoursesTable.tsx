import type { FC } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import CoursesTableItem from "~/components/courses/CoursesTableItem";

type CoursesTableT = {
  data?: (CourseModelT & {
    student: {
      grade: number;
      isEnrolled: boolean;
      isFollowing: boolean;
    };
    professors?: {
      id: number;
      fullname: string;
    }[];
  })[];
};

const CoursesTable: FC<CoursesTableT> = ({ data = [] }) => {
  return (
    <table>
      <colgroup>
        <col />
        <col />
        <col className="col-small" />
        <col className="col-small" />
        <col className="col-small" />
      </colgroup>
      <thead>
        <tr>
          <th>Course</th>
          <th>Instructors</th>
          <th>Semester</th>
          <th>Following</th>
          <th>Registered</th>
        </tr>
      </thead>
      <tbody>
        {data.map((x) => (
          <CoursesTableItem
            key={x.id}
            id={x.id}
            title={x.title}
            semester={x.semester}
            professors={x.professors || []}
            isFollowing={x.student.isFollowing}
            isRegistered={x.student.isEnrolled}
          />
        ))}
      </tbody>
    </table>
  );
};

export default CoursesTable;
