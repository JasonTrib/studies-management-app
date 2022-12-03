import { Link } from "@remix-run/react";
import type { FC } from "react";
import AvatarIcon from "~/components/icons/AvatarIcon";
import type { getStudentsForGrading } from "~/DAO/composites/composites.server";

type GradingTableItemT = {
  students: Awaited<ReturnType<typeof getStudentsForGrading>>;
  isBusy: boolean;
  graded?: boolean;
};

const GradingTableItem: FC<GradingTableItemT> = ({ students, isBusy, graded }) => {
  return (
    <>
      {students.map((student) => (
        <tr key={student.username}>
          <td className="text-start">
            <div className="username link">
              <AvatarIcon
                className={`icon ${getGenderColourClass(student.gender)}`}
                width={20}
                height={20}
              />
              <Link to={`/users/${student.userId}/profile`}>{student.username}</Link>
            </div>
          </td>
          {student.fullname ? (
            <td className="text-start">{student.fullname}</td>
          ) : (
            <td className="empty" />
          )}
          {student.email ? (
            <td className="text-start link">
              <a href={`mailto:${student.email}`}>{student.email}</a>
            </td>
          ) : (
            <td className="empty" />
          )}
          <td>{student.enrollmentYear}</td>
          {graded ? (
            <td>{student.grade}</td>
          ) : (
            <td className="action-cell">
              <input
                id={`${student.studentId}`}
                name={`${student.studentId}`}
                placeholder={`${student.grade !== null ? student.grade : ""}`}
                disabled={isBusy}
                type="number"
                min={0}
                max={10}
              />
            </td>
          )}
        </tr>
      ))}
    </>
  );
};

export default GradingTableItem;

const getGenderColourClass = (gender?: "M" | "F" | null) => {
  if (gender === "M") return "gender-male";
  if (gender === "F") return "gender-female";
  return "";
};
