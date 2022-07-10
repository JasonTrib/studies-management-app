import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Announcement, { links as AnnouncementLinks } from "~/components/announcements/Announcement";
import AppLayout from "~/components/AppLayout";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAnnoucement } from "~/DAO/announcementDAO.server";
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

  const announcement = await getAnnoucement(id);
  if (!announcement) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ announcement });
};

const AnnouncementDetailsPage = () => {
  const { announcement } = useLoaderData() as LoaderData;
  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          <Link to={`/courses/${announcement.course.id}`}>{announcement.course.title}</Link>
        </div>
        <Announcement data={announcement} />
      </>
    </AppLayout>
  );
};

export default AnnouncementDetailsPage;
