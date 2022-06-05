import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Course } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";

type LoaderData = {
  courses: Course[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();

  return json<LoaderData>({ courses });
};

const CourseIndexPage = () => {
  const { courses } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar"></div>
        <div className="content">
          <div>CourseIndexPage</div>
          <div>
            <h2>list of courses</h2>
            <ul>
              {courses.map((x) => (
                <li key={x.id}>
                  <Link to={`/courses/${x.id}`}>{x.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIndexPage;
