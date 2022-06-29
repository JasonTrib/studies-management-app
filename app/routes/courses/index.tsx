import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppSkeleton from "~/components/AppSkeleton";
import CoursesContainer, {
  links as CoursesContainerLinks,
} from "~/components/CoursesListContainer";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";

type LoaderData = {
  courses: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...CoursesContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();

  return json({ courses });
};

const CourseIndexPage = () => {
  const { courses } = useLoaderData() as LoaderData;
  return (
    <AppSkeleton>
      <CoursesContainer data={courses} />
    </AppSkeleton>
  );
};

export default CourseIndexPage;
