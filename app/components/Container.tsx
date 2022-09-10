import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import React from "react";
import announcementsStyles from "~/styles/announcements.css";
import butttonStyles from "~/styles/button.css";
import containerStyles from "~/styles/container.css";
import coursesStyles from "~/styles/courses.css";

type ContainerT = {
  title?: string;
  data?: any[];
  noResultsMsg?: string;
  maxItems?: number;
  moreLink?: string;
  Button?: JSX.Element;
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: containerStyles },
    { rel: "stylesheet", href: coursesStyles },
    { rel: "stylesheet", href: announcementsStyles },
    { rel: "stylesheet", href: butttonStyles },
  ];
};

const Container: FC<ContainerT> = ({
  title,
  data = [],
  noResultsMsg,
  maxItems,
  moreLink,
  Button,
  children,
  ...props
}) => {
  const slicedData = data.slice(0, maxItems);
  const moreExist = data.length > slicedData.length;
  const noContent = !!noResultsMsg || data.length > 0;

  const childrenWithProps = (data: any[], props: any) =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { data, ...props });
      }
      return child;
    });

  return (
    <div className="container-blueprint">
      {title && (
        <div className={`heading ${noContent ? "" : "no-content"}`}>
          <h3>{title}</h3>
          {Button}
        </div>
      )}
      {slicedData.length === 0 && noResultsMsg && (
        <div className="no-results-msg">{noResultsMsg}</div>
      )}
      {slicedData.length > 0 && (
        <div
          className={`content ${moreExist ? "no-padding-bot" : ""} ${title ? "" : "padding-top"}`}
        >
          {childrenWithProps(slicedData, props)}
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
