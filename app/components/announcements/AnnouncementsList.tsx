import type { FC } from "react";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { formatDate } from "~/utils/dateUtils";
import AnnouncementsListItem from "./AnnouncementsListItem";

type AnnouncementsListT = {
  data?: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
  deletable?: boolean;
  landingRoute?: string;
  untrimmed?: boolean;
};

const AnnouncementsList: FC<AnnouncementsListT> = ({
  data = [],
  deletable,
  landingRoute,
  untrimmed,
}) => {
  return (
    <>
      {data.map((x) => (
        <AnnouncementsListItem
          key={x.id}
          annId={x.id}
          title={x.title}
          body={x.body}
          date={formatDate(new Date(x.updated_at))}
          courseId={x.course_id}
          courseTitle={x.course.title}
          deletable={deletable}
          landingRoute={landingRoute}
          untrimmed={untrimmed}
        />
      ))}
    </>
  );
};

export default AnnouncementsList;
