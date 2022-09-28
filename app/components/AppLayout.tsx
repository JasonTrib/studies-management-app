import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { UserModelT } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import ActionButton from "./buttons/ActionButton";
import AnnouncementIcon from "./icons/AnnouncementIcon";
import AvatarIcon from "./icons/AvatarIcon";
import CoursesIcon from "./icons/CoursesIcon";
import DepartmentIcon from "./icons/DepartmentIcon";
import LogoutIcon from "./icons/LogoutIcon";
import MyCoursesIcon from "./icons/MyCoursesIcon";
import UsersIcon from "./icons/UsersIcon";

type AppLayoutT = {
  userInfo: {
    username: string;
    role?: UserModelT["role"];
    fullname?: string | null;
    gender?: string | null;
  };
};

const AppLayout: FC<AppLayoutT> = ({ userInfo, children }) => {
  const name = userInfo.fullname || userInfo.username;
  let avatarColor = "";
  if (userInfo.gender === "M") avatarColor = "gender-male";
  if (userInfo.gender === "F") avatarColor = "gender-female";
  const showMyCourses =
    userInfo.role === USER_ROLE.STUDENT || userInfo.role === USER_ROLE.PROFESSOR;

  return (
    <div className="app-container">
      <div className="topbar-logo">
        <div className="link-title">
          <Link to="/">
            <h1>Unilumnus</h1>
          </Link>
        </div>
      </div>
      <div className="topbar-main">
        <div className="actions link">
          <Link to="/my-profile">
            <div className="profile">
              <div className="avatar">
                <AvatarIcon width={20} height={20} className={`icon ${avatarColor}`} />
              </div>
              <div className="name">{name}</div>
            </div>
          </Link>
          <form action="/logout" method="post">
            <ActionButton type="submit" variant="cancel" size="md">
              <div className="logout-button">
                Logout
                <LogoutIcon />
              </div>
            </ActionButton>
          </form>
        </div>
      </div>
      <div className="sidebar">
        <div className="quicklinks-container link-simple">
          <Link to="/departments">
            <div className="quicklink">
              <DepartmentIcon width={20} height={20} />
              The department
            </div>
          </Link>
          <Link to="/users">
            <div className="quicklink">
              <UsersIcon width={20} height={20} />
              Users
            </div>
          </Link>
          <Link to="/courses">
            <div className="quicklink">
              <CoursesIcon width={20} height={20} />
              Courses
            </div>
          </Link>
          <div className="separator" />
          {showMyCourses && (
            <Link to="/my-courses">
              <div className="quicklink">
                <MyCoursesIcon width={20} height={20} />
                My courses
              </div>
            </Link>
          )}
          <Link to="/announcements">
            <div className="quicklink">
              <AnnouncementIcon width={20} height={20} />
              Announcements
            </div>
          </Link>
        </div>
      </div>
      <div className="content-main">{children}</div>
    </div>
  );
};

export default AppLayout;
