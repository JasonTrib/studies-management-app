import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import styles from "~/styles/box.css";

type BoxT = {
  height?: number;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Box: FC<BoxT> = ({ height }) => {
  const px = height ?? 0;

  return (
    <div className="box" style={{ height: px + "px" }}>
      {px + "px"}
    </div>
  );
};

export default Box;
