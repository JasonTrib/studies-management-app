import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import styles from "~/styles/container.css";

type ContainerT = {
  items?: number;
  maxItems?: number;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Container: FC<ContainerT> = ({ items, maxItems }) => {
  const n = items ?? 0;
  const data = [...Array(n)];
  let max: number;
  if (maxItems === undefined) {
    max = Number.POSITIVE_INFINITY;
  } else if (maxItems > 0) {
    max = maxItems;
  } else {
    max = 0;
  }
  const moreExist = max > 0 && data.length > max;

  return (
    <div className="container-blueprint">
      <div className="heading">
        <h2>Container</h2>
      </div>
      {!!data.length && max > 0 && (
        <div className={`content ${moreExist ? "no-padding-bot" : null}`}>
          {[...Array(n)]
            .filter((_, j) => j < max)
            .map((_, i) => (
              <div key={i} className="container-item">
                <div className="title">Title</div>
                <div className="body">Body</div>
              </div>
            ))}
        </div>
      )}
      {moreExist && (
        <div className="more link">
          <Link to="/">More...</Link>
        </div>
      )}
    </div>
  );
};

export default Container;
