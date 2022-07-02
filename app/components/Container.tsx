import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import containerStyles from "~/styles/container.css";
import coursesStyles from "~/styles/courses.css";
import announcementsStyles from "~/styles/announcements.css";

type ContainerT = {
  title?: string;
  data?: any[];
  maxItems?: number;
  moreLink?: string;
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: containerStyles },
    { rel: "stylesheet", href: coursesStyles },
    { rel: "stylesheet", href: announcementsStyles },
  ];
};

const Container: FC<ContainerT> = ({ title, data, maxItems, moreLink, children }) => {
  data ??= [];
  const slicedData = data.slice(0, maxItems);
  const moreExist = data.length > slicedData.length;

  const childrenWithProps = (data: any[]) =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { data });
      }
      return child;
    });

  return (
    <div className="container-blueprint">
      <div className={`${title ? "heading" : "no-heading"}`}>
        <h2>{title}</h2>
      </div>
      {slicedData && slicedData.length > 0 && (
        <div
          className={`content ${moreExist ? "no-padding-bot" : null} ${title ? null : "no-shadow"}`}
        >
          {childrenWithProps(slicedData)}
        </div>
      )}
      {moreExist && (
        <div className="more link">
          <Link to={`${moreLink || "#"}`}>More...</Link>
        </div>
      )}
    </div>
  );
};

export default Container;
