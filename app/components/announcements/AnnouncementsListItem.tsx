import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type AnnouncementsListItemT = {
  id: AnnouncementModelT["id"];
  title: AnnouncementModelT["title"];
  body: AnnouncementModelT["body"];
  course: CourseModelT["title"];
  date: string;
};

const AnnouncementsListItem: FC<AnnouncementsListItemT> = ({ id, title, body, course, date }) => {
  return (
    <div className="container-item announcements-list-item">
      <div className="title link">
        <Link to={`/announcements/${id}`}>{title}</Link>
      </div>
      <div className="body ellipsis-3">{body}</div>
      <div className="metadata">
        <span className="date mr-12">{date}</span>
        <span className="course">{course}</span>
      </div>
    </div>
  );
};

export default AnnouncementsListItem;
