import type { FC } from "react";
import React from "react";
import ActionButton from "./ActionButton";

const RegisterToCourseButton: FC = () => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    // post a form and then handle action server-side with a redirect to the courses page
    console.log("Clicked!");
  };

  return <ActionButton onClick={onClick}>Register to a course ↗</ActionButton>;
};

export default RegisterToCourseButton;
