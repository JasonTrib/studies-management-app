import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppSkeleton from "~/components/AppSkeleton";
import { getCourseAnnoucement } from "~/DAO/announcementDAO.server";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  announcement: AnnouncementModelT & {
    course: CourseModelT;
  };
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
    <AppSkeleton>
      <div>
        <h2>AnnouncementDetailsPage</h2>
        <p>course: {announcement.course.title}</p>
        <p>title: {announcement.title}</p>
        <p>body: {announcement.body}</p>
      </div>
    </AppSkeleton>
  );
};

export default AnnouncementDetailsPage;
