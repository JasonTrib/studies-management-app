import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import type { DepartmentModelT } from "~/DAO/departmentDAO.server";
import { getDepartment } from "~/DAO/departmentDAO.server";

type LoaderData = {
  department: DepartmentModelT;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const depId = params.depId;
  if (!depId) {
    throw new Response("Not Found", { status: 404 });
  }

  const department = await getDepartment(depId);

  if (!department) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ department });
};

const DepartmentDetailsPage = () => {
  const { department } = useLoaderData() as LoaderData;

  return (
    <AppLayout>
      <div>DepartmentDetailsPage</div>
      <div>
        <h2>department</h2>
        <p>title: {department.full_title}</p>
        <p>description: {department.description}</p>
      </div>
    </AppLayout>
  );
};

export default DepartmentDetailsPage;
