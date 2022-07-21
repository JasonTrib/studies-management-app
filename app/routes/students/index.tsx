import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import type { StudentModelT } from "~/DAO/studentDAO.server";
import { getAllStudents } from "~/DAO/studentDAO.server";

type LoaderData = {
  students: StudentModelT[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const students = await getAllStudents();
  return json({ students });
};

const StudentIndexPage = () => {
  const { students } = useLoaderData() as LoaderData;
  return (
    <AppLayout>
      <div>StudentIndexPage</div>
      <div>
        <h2>list of students</h2>
        {students.map((x) => (
          <li key={x.id}>
            <Link to={`/students/${x.id}`}>{x.id}</Link>
          </li>
        ))}
      </div>
    </AppLayout>
  );
};

export default StudentIndexPage;
