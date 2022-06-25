import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import type { FC } from "react";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/announcement.css";

type AnnouncementT = {
  id: AnnouncementModelT["id"];
  title: AnnouncementModelT["title"];
  body: AnnouncementModelT["body"];
  course: CourseModelT["title"];
  date: AnnouncementModelT["updated_at"];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Announcement: FC<AnnouncementT> = ({ id, title, body, course, date }) => {
  return (
    <div className="announcement-container">
      <div className="title">
        <Link to={`/announcements/${id}`}>{title}</Link>
      </div>
      <div className="body">{body}</div>
      <div className="info">
        {course}
        {date}
      </div>
    </div>
  );
};

export default Announcement;
