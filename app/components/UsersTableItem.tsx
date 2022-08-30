import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { ProfessorModelT } from "~/DAO/professorDAO.server";
import type { ProfileModelT } from "~/DAO/profileDAO.server";
import type { RegistrarModelT } from "~/DAO/registrarDAO.server";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import AvatarIcon from "./icons/AvatarIcon";

type UsersTableItemT = {
  username: UserModelT["username"];
  regId?: RegistrarModelT["id"];
  profId?: ProfessorModelT["id"];
  studentId?: StudentModelT["id"];
  gender?: ProfileModelT["gender"];
  fullname?: ProfileModelT["fullname"];
  email?: ProfileModelT["email"];
  title?: ProfessorModelT["title"];
  enrollmentYear?: StudentModelT["enrollment_year"];
  studiesStatus?: StudentModelT["studies_status"];
  courseNumber?: number;
  isCurrent: boolean;
};

const UsersTableItem: FC<UsersTableItemT> = ({
  username,
  regId,
  profId,
  studentId,
  gender,
  fullname,
  email,
  title,
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
          {regId && <Link to={`/registrars/${regId}`}>{username}</Link>}
          {profId && <Link to={`/professors/${profId}`}>{username}</Link>}
          {studentId && <Link to={`/students/${studentId}`}>{username}</Link>}
        </div>
      </td>
      <td className={`${!fullname ? "empty" : ""}`}>{fullname}</td>
      {title && <td> {title}</td>}
      <td className={`${!email ? "empty" : ""}`}>{email}</td>
      {enrollmentYear && <td className="table-center">{enrollmentYear}</td>}
      {studiesStatus && <td className="table-center"> {studiesStatus}</td>}
      {typeof courseNumber === "number" && <td className="table-center">{courseNumber}</td>}
    </tr>
  );
};

export default UsersTableItem;
