import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsContainer, {
  links as AnnouncementsContainerLinks,
} from "~/components/AnnouncementsContainer";
import AppSkeleton from "~/components/AppSkeleton";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAllAnnoucements } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";

export type LoaderData = {
  announcements: (AnnouncementModelT & {
    course: {
      title: CourseModelT["title"];
    };
  })[];
};

export const links: LinksFunction = () => {
  return [...AnnouncementsContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const announcements = await getAllAnnoucements();
  return json({ announcements });
};

const AnnouncementIndexPage = () => {
  const { announcements } = useLoaderData() as LoaderData;

  return (
    <AppSkeleton>
      <AnnouncementsContainer data={announcements} />
    </AppSkeleton>
  );
};

export default AnnouncementIndexPage;
