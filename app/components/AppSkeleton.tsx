import { Link } from "@remix-run/react";
import type { FC } from "react";

const AppSkeleton: FC = ({ children }) => {
  return (
    <div>
      <div className="app-container">
        <div className="appbar">
          <h1>Studies Management App</h1>
          <Link to="/">Home</Link>
        </div>
        <div className="container">
          <div className="sidebar">
            <div>
              <Link to="/departments">Departments</Link>
            </div>
            <div>
              <Link to="/registrars">Registrars</Link>
            </div>
            <div>
              <Link to="/professors">Professors</Link>
            </div>
            <div>
              <Link to="/students">Students</Link>
            </div>
            <div>
              <Link to="/courses">Courses</Link>
            </div>
            <div>
              <Link to="/announcements">Announcements</Link>
            </div>
          </div>
          <div className="page-content">
            <div className="main-feed">{children}</div>
            <div className="side-feed"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSkeleton;
