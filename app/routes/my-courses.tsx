import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { links as ContainerLinks } from "~/components/Container";
import MyCoursesTable from "~/components/MyCoursesTable";
import Table, { links as TableLinks } from "~/components/Table";
import { getCoursesRegistered } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";

type LoaderData = {
  coursesRegistered: CourseModelT[];
};

export const links: LinksFunction = () => {
  return [...ContainerLinks(), ...TableLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const studentID = 2;

  const coursesRegistered = await getCoursesRegistered(studentID);

  return json({ coursesRegistered });
};

const MyCoursesPage = () => {
  const { coursesRegistered } = useLoaderData() as LoaderData;

  return (
    <AppLayout wide>
      <Table data={coursesRegistered}>
        <MyCoursesTable />
      </Table>
    </AppLayout>
  );
};

export default MyCoursesPage;
