import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./buttons/ActionButton";
import AvatarIcon from "./icons/AvatarIcon";
import LogoutIcon from "./icons/LogoutIcon";

type AppLayoutT = {
  userInfo: {
    username: string;
    fullname?: string | null;
    gender?: string | null;
  };
};

const AppLayout: FC<AppLayoutT> = ({ userInfo, children }) => {
  const name = userInfo.fullname || userInfo.username;
  let avatarColor = "";
  if (userInfo.gender === "M") avatarColor = "gender-male";
  if (userInfo.gender === "F") avatarColor = "gender-female";

  return (
    <div className="app-container">
      <div className="topbar">
        <div className="link-title">
          <Link to="/">
            <h1>Unilumnus</h1>
          </Link>
        </div>
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
      <div className="container">
        <div className="sidebar">
          <div>
            <Link to="/departments">Departments</Link>
          </div>
          <div>
            <Link to="/users">Users</Link>
          </div>
          <div>
            <Link to="/users/registrars">Registrars</Link>
          </div>
          <div>
            <Link to="/users/professors/new">New professor</Link>
          </div>
          <div>
            <Link to="/users/professors">Professors</Link>
          </div>
          <div>
            <Link to="/users/students/new">New student</Link>
          </div>
          <div>
            <Link to="/users/students">Students</Link>
          </div>
          <div>
            <Link to="/courses/new">New course</Link>
          </div>
          <div>
            <Link to="/courses">Courses</Link>
          </div>
          <div>
            <Link to="/my-courses">My courses</Link>
          </div>
          <div>
            <Link to="/announcements">Announcements</Link>
          </div>
          <div>
            <Link to="/my-profile/edit">Edit profile</Link>
          </div>
          <div>
            <Link to="/my-profile">My profile</Link>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
