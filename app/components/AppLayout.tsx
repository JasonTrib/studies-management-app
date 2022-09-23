import { Link } from "@remix-run/react";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import ActionButton from "./buttons/ActionButton";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import HomeIcon from "./icons/HomeIcon";

type AppLayoutT = {
  wide?: boolean;
  breadcrumbs?: {
    seg: string;
    text: string;
    isLink: boolean;
  }[];
  title?: string;
  children?: JSX.Element[] | JSX.Element;
};

const AppLayout: FC<AppLayoutT> = ({ wide, breadcrumbs, title, children }) => {
  const [offsprings, setOffspings] = useState<JSX.Element[]>([]);
  const lastCrumb = breadcrumbs?.[breadcrumbs.length - 1].text;
  const showBreadCrumbs = !!lastCrumb;
  const derivedTitle = title || lastCrumb;
  const showPageHeading = !!derivedTitle;

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
    <div className="app-container">
      <div className="appbar">
        <h1>Studies Management App</h1>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
        <div>
          <Link to="/logout">Logout</Link>
        </div>
        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
          <form action="/logout" method="post">
            <ActionButton type="submit" variant="cancel" size="md">
              Logout
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
        <div className="page">
          {showPageHeading && (
            <div className="page-heading">
              {showBreadCrumbs && (
                <div className="breadcrumbs">
                  <div className="svg-link link">
                    <Link to="/">
                      <HomeIcon className="home-icon" width={14} height={14} />
                      <span>Home</span>
                    </Link>
                  </div>
                  <ChevronRightIcon className="icon" />
                  {breadcrumbs?.slice(0, -1).map((crumb) => (
                    <React.Fragment key={crumb.seg}>
                      {crumb.isLink ? (
                        <span className="link">
                          <Link to={`${crumb.seg}`}>{crumb.text}</Link>
                        </span>
                      ) : (
                        crumb.text
                      )}
                      <ChevronRightIcon className="icon" />
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div className="title">{derivedTitle}</div>
            </div>
          )}
          <div className="page-content">
            {wide ? (
              <div className="wide-content-feed">
                <div>{offsprings[0]}</div>
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
