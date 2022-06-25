import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Announcement from "~/components/Announcement";
import AppSkeleton from "~/components/AppSkeleton";
import { getAllAnnoucements } from "~/DAO/announcementDAO.server";
import { links as AnnouncementLinks } from "~/components/Announcement";

type LoaderData = {
  announcements: AnnouncementModelT[];
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const announcements = await getAllAnnoucements();
  return json({ announcements });
};

const AnnouncementIndexPage = () => {
  const { announcements } = useLoaderData() as LoaderData;
  return (
    <AppSkeleton>
      <div>AnnouncementIndexPage</div>
      <div>
        <h2>list of announcements</h2>
        {announcements.map((x) => (
          <Announcement key={x.id} id={x.id} title={x.title} body={x.body} date={x.updated_at} />
        ))}
      </div>
    </AppSkeleton>
  );
};

export default AnnouncementIndexPage;
