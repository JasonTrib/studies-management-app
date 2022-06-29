import { Link } from "@remix-run/react";
import type { FC } from "react";
import { useEffect, useState } from "react";

type AppSkeletonT = {
  wide?: boolean;
  children?: JSX.Element[] | JSX.Element;
};

const AppSkeleton: FC<AppSkeletonT> = ({ wide, children }) => {
  const [offspring, setOffsping] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (children) {
      if (!Array.isArray(children)) {
        setOffsping([children]);
      } else {
        setOffsping(children);
      }
    }
  }, [children, offspring]);

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
            {wide ? (
              <div className="wide-content-feed">{offspring[0]}</div>
            ) : (
              <div className="content-feed">
                <div className="main-feed">{offspring[0]}</div>
                <div className="side-feed">{offspring[1]}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSkeleton;
