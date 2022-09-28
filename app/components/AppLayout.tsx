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
            <div className="quicklink">The department</div>
          </Link>
          <Link to="/users">
            <div className="quicklink">Users</div>
          </Link>
          <Link to="/courses">
            <div className="quicklink">Courses</div>
          </Link>
          <div className="separator" />
          <Link to="/my-courses">
            <div className="quicklink">My courses</div>
          </Link>
          <Link to="/announcements">
            <div className="quicklink">Announcements</div>
          </Link>
        </div>
      </div>
      <div className="content-main">{children}</div>
    </div>
  );
};

export default AppLayout;
