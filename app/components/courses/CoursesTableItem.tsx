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
  isRegistered?: boolean;
  grade?: number | null;
};

const CoursesTableItem: FC<CoursesTableItemT> = ({
  id,
  title,
  semester,
  professors,
  isFollowing,
  isRegistered,
  grade,
}) => {
  const [checked, setChecked] = useState(isFollowing);
  const [checked2, setChecked2] = useState(isRegistered);
  const handleClick = () => setChecked((prev) => !prev);
  const handleClick2 = () => setChecked2((prev) => !prev);

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
            disabled={false}
            checked={checked}
            onChange={handleClick}
            className="checkbox-large"
          />
        </td>
      )}
      {isRegistered !== undefined && (
        <td className="table-center cell-checkbox">
          <input
            type="checkbox"
            disabled={false}
            checked={checked2}
            onChange={handleClick2}
            className="checkbox-large"
          />
        </td>
      )}
    </tr>
  );
};

export default CoursesTableItem;
