import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Announcement, { links as AnnouncementLinks } from "~/components/Announcement";
import AppSkeleton from "~/components/AppSkeleton";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getCourseAnnoucement } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  announcement: AnnouncementModelT & {
    course: CourseModelT;
  };
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.announcementId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const announcement = await getCourseAnnoucement(id);
  if (!announcement) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ announcement });
};

const AnnouncementDetailsPage = () => {
  const { announcement } = useLoaderData() as LoaderData;
  return (
    <AppSkeleton wide>
      <>
        <div className="content-heading link">
          <Link to={`/courses/${announcement.course.id}`}>{announcement.course.title}</Link>
        </div>
        <Announcement data={announcement} />
      </>
    </AppSkeleton>
  );
};

export default AnnouncementDetailsPage;
