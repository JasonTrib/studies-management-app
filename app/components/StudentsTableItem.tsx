import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { ProfileModelT } from "~/DAO/profileDAO.server";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import AvatarIcon from "./icons/AvatarIcon";

type StudentsTableItemT = {
  username: UserModelT["username"];
  studentId: StudentModelT["id"];
  gender?: ProfileModelT["gender"];
  fullname?: ProfileModelT["fullname"];
  email?: ProfileModelT["email"];
  enrollmentYear: StudentModelT["enrollment_year"];
  studiesStatus: StudentModelT["studies_status"];
  courseNumber: number;
  isCurrent: boolean;
};

const StudentsTableItem: FC<StudentsTableItemT> = ({
  username,
  studentId,
  gender,
  fullname,
  email,
  enrollmentYear,
  studiesStatus,
  courseNumber,
  isCurrent,
}) => {
  let avatarColor = "";
  if (gender === "M") avatarColor = "gender-male";
  if (gender === "F") avatarColor = "gender-female";

  return (
    <tr className={`${isCurrent ? "current" : ""}`}>
      <td>
        <div className="username link">
          <AvatarIcon className={`icon ${avatarColor}`} width={20} height={20} />
          <Link to={`/students/${studentId}`}>{username}</Link>
        </div>
      </td>
      <td className={`${!fullname ? "empty" : ""}`}>{fullname}</td>
      <td className={`${!email ? "empty" : ""}`}>{email}</td>
      <td className="table-center">{enrollmentYear}</td>
      <td className="table-center"> {studiesStatus}</td>
      <td className="table-center">{courseNumber}</td>
    </tr>
  );
};

export default StudentsTableItem;
