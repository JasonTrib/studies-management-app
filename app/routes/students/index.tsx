import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Student } from "~/models/student.server";
import { getAllStudents } from "~/models/student.server";

type LoaderData = {
  students: Student[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const students = await getAllStudents();
  return json<LoaderData>({ students });
};

const StudentIndexPage = () => {
  const { students } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar"></div>
        <div className="content">
          <div>StudentIndexPage</div>
          <div>
            <h2>list of students</h2>
            {students.map((x) => (
              <li key={x.id}>
                <Link to={`/students/${x.id}`}>{x.id}</Link>
              </li>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentIndexPage;
