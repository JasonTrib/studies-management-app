import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./ActionButton";

type NewButtonT = {
  directTo: string;
};
const NewButton: FC<NewButtonT> = ({ directTo }) => {
  return (
    <Link to={directTo}>
      <ActionButton>+ New</ActionButton>
    </Link>
  );
};

export default NewButton;
