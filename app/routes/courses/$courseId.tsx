import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Course } from "~/DAO/courseDAO.server";
import { getCourse } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  course: Course;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.courseId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const course = await getCourse(id);
  if (!course) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ course });
};

const CourseDetailsPage = () => {
  const { course } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar">
          <Link to="/courses">Courses</Link>
        </div>
        <div className="content">
          <div>
            <h2>CourseDetailsPage</h2>
            <span>courseId: {course.title}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetailsPage;
