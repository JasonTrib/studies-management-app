import type { LinksFunction } from "@remix-run/node";
import type { FC } from "react";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import styles from "~/styles/announcements.css";
import { formatDate } from "~/utils/dateUtils";
import Announcement from "./Announcement";

type AnnouncementsContainerT = {
  data: (AnnouncementModelT & {
    course: {
      title: CourseModelT["title"];
    };
  })[];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const AnnouncementsContainer: FC<AnnouncementsContainerT> = ({ data }) => {
  return (
    <div className="announcements-container">
      <div className="heading">
        <h2>Announcements</h2>
      </div>
      <div className="content">
        {data.map((x) => (
          <Announcement
            key={x.id}
            id={x.id}
            title={x.title}
            body={x.body}
            date={formatDate(new Date(x.updated_at))}
            course={x.course.title}
          />
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsContainer;
