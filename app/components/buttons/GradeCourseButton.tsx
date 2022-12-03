import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./ActionButton";

type GradeCourseButtonT = {
  courseId: number;
};

const GradeCourseButton: FC<GradeCourseButtonT> = ({ courseId }) => {
  return (
    <Link to={`/courses/${courseId}/grading`}>
      <ActionButton>Grade students</ActionButton>
    </Link>
  );
};

export default GradeCourseButton;
