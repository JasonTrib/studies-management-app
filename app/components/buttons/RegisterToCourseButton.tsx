import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./ActionButton";

const RegisterToCourseButton: FC = () => {
  return (
    <Link to="/studies/course-registration">
      <ActionButton>Register to a course</ActionButton>
    </Link>
  );
};

export default RegisterToCourseButton;
