import type { FC } from "react";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { formatDate } from "~/utils/dateUtils";
import AnnouncementsListItem from "./AnnouncementsListItem";

type AnnouncementsListT = {
  data?: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
};

const AnnouncementsList: FC<AnnouncementsListT> = ({ data = [] }) => {
  return (
    <>
      {data.map((x) => (
        <AnnouncementsListItem
          key={x.id}
          id={x.id}
          title={x.title}
          body={x.body}
          date={formatDate(new Date(x.updated_at))}
          course={x.course.title}
        />
      ))}
    </>
  );
};

export default AnnouncementsList;
