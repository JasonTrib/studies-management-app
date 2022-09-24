import { Link } from "@remix-run/react";
import ActionButton from "./ActionButton";

const NewCourseButton = () => {
  return (
    <Link to={`/courses/new`}>
      <ActionButton>+ New</ActionButton>
    </Link>
  );
};

export default NewCourseButton;
