import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import Container, { links as ContainerLinks } from "~/components/Container";
import CoursesList from "~/components/CoursesList";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";

type LoaderData = {
  courses: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();

  return json({ courses });
};

const CourseIndexPage = () => {
  const { courses } = useLoaderData() as LoaderData;
  return (
    <AppLayout>
      <Container title="Courses" data={courses}>
        <CoursesList />
      </Container>
    </AppLayout>
  );
};

export default CourseIndexPage;
