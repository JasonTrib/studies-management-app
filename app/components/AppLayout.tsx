import { Link } from "@remix-run/react";
import type { FC } from "react";
import { useEffect, useState } from "react";

type AppLayoutT = {
  wide?: boolean;
  children?: JSX.Element[] | JSX.Element;
};

const AppLayout: FC<AppLayoutT> = ({ wide, children }) => {
  const [offsprings, setOffspings] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (children) {
      if (!Array.isArray(children)) {
        setOffspings([children]);
      } else {
        setOffspings(children);
      }
    }
  }, [children]);

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
              <Link to="/professors/new">New professor</Link>
            </div>
            <div>
              <Link to="/professors">Professors</Link>
            </div>
            <div>
              <Link to="/students/new">New student</Link>
            </div>
            <div>
              <Link to="/students">Students</Link>
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
              <Link to="/announcements/new">New announcement</Link>
            </div>
            <div>
              <Link to="/announcements">Announcements</Link>
            </div>
            <div>
              <Link to="/profile/edit">Edit profile</Link>
            </div>
            <div>
              <Link to="/profile">Profile</Link>
            </div>
          </div>
          <div className="page-content">
            {wide ? (
              <div className="wide-content-feed">
                <div className="mb-32">{offsprings[0]}</div>
                <div className="content-feed">
                  <div className="main-feed">{offsprings[1]}</div>
                  <div className="side-feed">{offsprings[2]}</div>
                </div>
              </div>
            ) : (
              <div className="content-feed">
                <div className="main-feed">{offsprings[0]}</div>
                <div className="side-feed">{offsprings[1]}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
