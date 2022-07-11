import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import React from "react";
import announcementsStyles from "~/styles/announcements.css";
import butttonStyles from "~/styles/button.css";
import containerStyles from "~/styles/container.css";
import coursesStyles from "~/styles/courses.css";
import tableStyles from "~/styles/table.css";

type TableT = {
  data?: any[];
  noResults?: string;
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: containerStyles },
    { rel: "stylesheet", href: tableStyles },
    { rel: "stylesheet", href: coursesStyles },
    { rel: "stylesheet", href: announcementsStyles },
    { rel: "stylesheet", href: butttonStyles },
  ];
};

const Table: FC<TableT> = ({ data = [], noResults, children }) => {
  const childrenWithProps = (data: any[]) =>
    React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, { data });
      }
      return child;
    });

  return (
    <>
      {data.length === 0 && noResults ? (
        <div className="table-no-results">
          <h3>{noResults}</h3>
        </div>
      ) : (
        childrenWithProps(data)
      )}
    </>
  );
};

export default Table;
