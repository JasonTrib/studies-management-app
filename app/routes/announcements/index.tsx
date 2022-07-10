import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsList from "~/components/announcements/AnnouncementsList";
import AppLayout from "~/components/AppLayout";
import Container, { links as ContainerLinks } from "~/components/Container";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAllAnnoucements } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";

export type LoaderData = {
  announcements: (AnnouncementModelT & {
    course: CourseModelT;
  })[];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const announcements = await getAllAnnoucements();
  return json({ announcements });
};

const AnnouncementIndexPage = () => {
  const { announcements } = useLoaderData() as LoaderData;

  return (
    <AppLayout>
      <Container title="Announcements" data={announcements}>
        <AnnouncementsList />
      </Container>
    </AppLayout>
  );
};

export default AnnouncementIndexPage;
