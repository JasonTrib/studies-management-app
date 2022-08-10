import { Link } from "@remix-run/react";
import type { FC } from "react";
import React, { useState } from "react";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type CoursesTableItemT = {
  id: CourseModelT["id"];
  title: CourseModelT["title"];
  professors: {
    id: number;
    fullname: string;
  }[];
  semester?: CourseModelT["semester"];
  isFollowing?: boolean;
  isEnrolled?: boolean;
  isLecturing?: boolean;
  grade?: number | null;
};

const CoursesTableItem: FC<CoursesTableItemT> = ({
  id,
  title,
  semester,
  professors,
  isFollowing,
  isEnrolled,
  isLecturing,
  grade,
}) => {
  const [checked, setChecked] = useState(isFollowing);
  const handleChange = () => setChecked((prev) => !prev);

  return (
    <tr>
      <td className="link">
        <Link to={`/courses/${id}`}>{title}</Link>
      </td>
      <td className="instructors">
        {!!professors.length && (
          <span className="link-simple">
            {professors.map((prof, i) => (
              <React.Fragment key={prof.id}>
                <Link to={`/professors/${prof.id}`}>{prof.fullname}</Link>
                {i < professors.length - 1 && " - "}
              </React.Fragment>
            ))}
          </span>
        )}
      </td>
      {semester && <td className="semester table-center">{semester}</td>}
      {grade !== undefined && <td className="table-center">{grade !== null ? grade : "-"} </td>}
      {isFollowing !== undefined && (
        <td className="table-center cell-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={false}
            className="checkbox-large"
          />
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
