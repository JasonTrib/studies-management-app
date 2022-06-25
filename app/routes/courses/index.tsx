import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppSkeleton from "~/components/AppSkeleton";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getAllCourses } from "~/DAO/courseDAO.server";

type LoaderData = {
  courses: CourseModelT[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const courses = await getAllCourses();

  return json({ courses });
};

const CourseIndexPage = () => {
  const { courses } = useLoaderData() as LoaderData;
  return (
    <AppSkeleton>
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
    </AppSkeleton>
  );
};

export default CourseIndexPage;
