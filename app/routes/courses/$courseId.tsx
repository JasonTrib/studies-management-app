import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppSkeleton from "~/components/AppSkeleton";
import type { CourseModelT } from "~/DAO/courseDAO.server";
import { getCourse } from "~/DAO/courseDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  course: CourseModelT;
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

  return json({ course });
};

const CourseDetailsPage = () => {
  const { course } = useLoaderData() as LoaderData;
  return (
    <AppSkeleton>
      <div>
        <h2>CourseDetailsPage</h2>
        <span>courseId: {course.title}</span>
      </div>
    </AppSkeleton>
  );
};

export default CourseDetailsPage;
