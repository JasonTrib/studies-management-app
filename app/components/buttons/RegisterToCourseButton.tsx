import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./ActionButton";

const RegisterToCourseButton: FC = () => {
  return (
    <Link to="/courses">
      <ActionButton>Register to a course ↗</ActionButton>
    </Link>
  );
};

export default RegisterToCourseButton;
