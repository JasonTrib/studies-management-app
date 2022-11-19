import { Link } from "@remix-run/react";
import type { FC } from "react";
import React, { useState } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import GradIcon from "~/components/icons/GradIcon";
import CompletedIcon from "../icons/CompletedIcon";

type CoursesTableItemT = {
  courseId: CourseModelT["id"];
  title: CourseModelT["title"];
  isPostgraduate: boolean;
  professors: {
    id: number;
    fullname: string;
  }[];
  semester?: CourseModelT["semester"];
  isFollowing?: boolean;
  isEnrolled?: boolean;
  isLecturing?: boolean;
  grade?: number | null;
  hasPassed?: boolean;
  showHasPassed?: boolean;
};

const CoursesTableItem: FC<CoursesTableItemT> = ({
  courseId,
  title,
  isPostgraduate,
  professors,
  semester,
  isFollowing,
  isEnrolled,
  isLecturing,
  grade,
  hasPassed,
  showHasPassed,
}) => {
  const [checked, setChecked] = useState(isFollowing);
  const handleChange = () => setChecked((prev) => !prev);

  return (
    <tr>
      <td>
        <div className="course link">
          {showHasPassed && hasPassed && (
            <CompletedIcon className="icon" width={20} height={20} fill="limegreen" />
          )}
          {isPostgraduate && <GradIcon className="icon" width={20} height={20} />}
          <Link to={`/courses/${courseId}`}>{title}</Link>
        </div>
      </td>
      <td className="instructors">
        {!!professors.length && (
          <span className="link-simple">
            {professors.map((prof, i) => (
              <React.Fragment key={prof.id}>
                <Link to={`/users/professors/${prof.id}`}>{prof.fullname}</Link>
                {i < professors.length - 1 && " - "}
              </React.Fragment>
            ))}
          </span>
        )}
      </td>
      {semester && <td className="semester table-center">{semester}</td>}
      {grade !== undefined &&
        (grade !== null ? (
          <td className={`table-center ${grade < 5 ? "low-grade" : ""}`}>{grade}</td>
        ) : (
          <td className="table-center empty" />
        ))}
      {isFollowing !== undefined && (
        <td className="table-center cell-checkbox">
          {isFollowing && (
            <input
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled
              className="checkbox-large"
            />
          )}
        </td>
      )}
      {isEnrolled !== undefined && (
        <td className="table-center cell-checkbox">
          {isEnrolled && (
            <input type="checkbox" checked={isEnrolled} disabled className="checkbox-large" />
          )}
        </td>
      )}
      {isLecturing !== undefined && (
        <td className="table-center cell-checkbox">
          {isLecturing && (
            <input type="checkbox" checked={isLecturing} disabled className="checkbox-large" />
          )}
        </td>
      )}
    </tr>
  );
};

export default CoursesTableItem;
