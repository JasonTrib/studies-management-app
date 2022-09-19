import { Link } from "@remix-run/react";
import type { FC } from "react";
import ActionButton from "./ActionButton";

type NewAnnouncementButtonT = {
  courseId: number;
};

const NewAnnouncementButton: FC<NewAnnouncementButtonT> = ({ courseId }) => {
  return (
    <Link to={`/courses/${courseId}/announcements/new`}>
      <ActionButton>+ New</ActionButton>
    </Link>
  );
};

export default NewAnnouncementButton;
