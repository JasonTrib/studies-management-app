import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { getStudentProfile } from "~/DAO/studentDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderDataT = {
  student: Exclude<Awaited<ReturnType<typeof getStudentProfile>>, null>;
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

  return json({ student });
};

const StudentDetailsPage = () => {
  const { student } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout>
      <div>
        <h2>StudentDetailsPage</h2>
        <p>student id: {student.id}</p>
        <p>student department: {student.user.dep_id}</p>
        <p>student name: {student.user.profile?.fullname}</p>
      </div>
    </AppLayout>
  );
};

export default StudentDetailsPage;
