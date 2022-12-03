import { Link } from "@remix-run/react";
import ActionButton from "./ActionButton";

export const MyCoursesButton = () => {
  return (
    <Link to="/my-courses">
      <ActionButton variant="cancel" size="custom">
        My courses
      </ActionButton>
    </Link>
  );
};
