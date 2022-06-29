import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AnnouncementsContainer, {
  links as AnnouncementsContainerLinks,
} from "~/components/AnnouncementsListContainer";
import AppSkeleton from "~/components/AppSkeleton";
import CoursesContainer, {
  links as CoursesContainerLinks,
} from "~/components/CoursesListContainer";
import type { AnnouncementModelT } from "~/DAO/announcementDAO.server";
import { getAllAnnoucements } from "~/DAO/announcementDAO.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";

export type LoaderData = {
  announcements: (AnnouncementModelT & {
    course: {
      title: CourseModelT["title"];
    };
  })[];
  courses: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...AnnouncementsContainerLinks(), ...CoursesContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const announcements = await getAllAnnoucements();
  const courses = await getAllCourses();

  return json({ announcements, courses });
};

export default function Index() {
  const { announcements, courses } = useLoaderData() as LoaderData;

  return (
    <div>
      <AppSkeleton>
        <>
          <AnnouncementsContainer data={announcements} />
          <CoursesContainer data={courses} />
        </>
        <>
          <CoursesContainer data={courses} />
          <AnnouncementsContainer data={announcements} />
        </>
      </AppSkeleton>
    </div>
  );
}
