import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { links as ContainerLinks } from "~/components/Container";
import CoursesTable from "~/components/CoursesTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getCoursesExtended } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type LoaderData = {
  courses: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const dep = "IT";
  const studentID = 1;

  const courses = await getCoursesExtended(dep, studentID);

  return json({ courses });
};

const CourseIndexPage = () => {
  const { courses } = useLoaderData() as LoaderData;

  return (
    <AppLayout wide>
      <Table data={courses}>
        <CoursesTable />
      </Table>
    </AppLayout>
  );
};

export default CourseIndexPage;
