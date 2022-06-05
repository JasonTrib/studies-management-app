import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Student } from "~/DAO/studentDAO.server";
import { getStudentProfile } from "~/DAO/studentDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  student:
    | (Student & {
        user: {
          profile: Profile | null;
        };
      })
    | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.studentId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const student = await getStudentProfile(id);

  if (!student) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ student });
};

const StudentDetailsPage = () => {
  const { student } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar">
          <Link to="/students">Students</Link>
        </div>
        <div className="content">
          <div>
            <h2>StudentDetailsPage</h2>
            <p>student id: {student?.id}</p>
            <p>student department: {student?.department}</p>
            <p>student name: {student?.user.profile?.name}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailsPage;
