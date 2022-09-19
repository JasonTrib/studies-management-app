import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { ProfessorModelT } from "~/DAO/professorDAO.server";
import type { ProfileModelT } from "~/DAO/profileDAO.server";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import type { UserModelT } from "~/DAO/userDAO.server";
import AvatarIcon from "~/components/icons/AvatarIcon";
import DeleteIcon from "../icons/DeleteIcon";

type UsersTableItemT = {
  userId: UserModelT["id"];
  username: UserModelT["username"];
  gender?: ProfileModelT["gender"];
  fullname?: ProfileModelT["fullname"];
  email?: ProfileModelT["email"];
  isPublic?: ProfileModelT["is_public"];
  title?: ProfessorModelT["title"];
  enrollmentYear?: StudentModelT["enrollment_year"];
  studiesStatus?: StudentModelT["studies_status"];
  courseNumber?: number;
  isCurrent?: boolean;
  openModal?: (profId: number) => void;
  profId?: number;
};

const UsersTableItem: FC<UsersTableItemT> = ({
  userId,
  username,
  gender,
  fullname,
  email,
  isPublic,
  title,
  enrollmentYear,
  studiesStatus,
  courseNumber,
  isCurrent,
  openModal,
  profId,
}) => {
  const show = isCurrent || isPublic;
  let avatarColor = "";
  if (gender === "M") avatarColor = "gender-male";
  if (gender === "F") avatarColor = "gender-female";

  return (
    <tr className={`${isCurrent ? "current" : ""}`}>
      <td>
        <div className="username link">
          <AvatarIcon className={`icon ${avatarColor}`} width={20} height={20} />
          <Link to={`/users/${userId}/profile`}>{username}</Link>
        </div>
      </td>
      {title && <td>{title}</td>}
      {show && fullname ? <td>{fullname}</td> : <td className="empty" />}
      {email !== undefined && (show && email ? <td>{email}</td> : <td className="empty" />)}
      {enrollmentYear && <td className="table-center">{enrollmentYear}</td>}
      {studiesStatus && <td className="table-center"> {studiesStatus}</td>}
      {typeof courseNumber === "number" && <td className="table-center">{courseNumber}</td>}
      {openModal && (
        <td className="table-center action-cell">
          <DeleteIcon
            height={20}
            width={20}
            className="icon"
            onClick={() => profId && openModal(profId)}
          />
        </td>
      )}
    </tr>
  );
};

export default UsersTableItem;
