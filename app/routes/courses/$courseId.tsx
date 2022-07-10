import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import Course, { links as CourseLinks } from "~/components/Course";
import { getCourseExtended } from "~/DAO/composites/composites.server";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  course: CourseModelT & {
    students_registered: number;
    students_following: number;
    professors: {
      id: number;
      name: string;
      surname: string;
    }[];
  };
};

export const links: LinksFunction = () => {
  return [...CourseLinks()];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.courseId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const course = await getCourseExtended(id);
  if (!course) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ course });
};

const CourseDetailsPage = () => {
  const { course } = useLoaderData() as LoaderData;

  course.description =
    "Database management courses introduce students to languages, applications and programming used for the" +
    "design and maintenance of business databases. One of the basic skills covered in database management courses" +
    "is the use of Structured Query Language (SQL), the most common database manipulation language.";

  return (
    <AppLayout wide>
      <>
        <div className="content-heading link">
          <Link to={`/courses`}>My courses</Link>
        </div>
        <Course data={course} />
      </>
    </AppLayout>
  );
};

export default CourseDetailsPage;
