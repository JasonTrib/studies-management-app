import { Link } from "@remix-run/react";
import type { FC } from "react";
import React, { useEffect, useState } from "react";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import HomeIcon from "../icons/HomeIcon";

type PageT = {
  wide?: boolean;
  breadcrumbs?: {
    seg: string;
    text: string;
    isLink: boolean;
  }[];
  title?: string;
  Actions?: JSX.Element | null;
  children?: JSX.Element[] | JSX.Element;
};

const Page: FC<PageT> = ({ wide, breadcrumbs, title, Actions, children }) => {
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
          <div className="title-container">
            <div className="title">{derivedTitle}</div>
            {Actions && <div className="actions">{Actions}</div>}
          </div>
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
  );
};

export default Page;
