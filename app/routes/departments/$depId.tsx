import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Page from "~/components/layout/Page";
import { getDepartment } from "~/DAO/departmentDAO.server";

type LoaderDataT = {
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
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
  const { department } = useLoaderData() as LoaderDataT;

  return (
    <Page>
      <div>DepartmentDetailsPage</div>
      <div>
        <h2>department</h2>
        <p>title: {department.title}</p>
        <p>description: {department.description}</p>
      </div>
    </Page>
  );
};

export default DepartmentDetailsPage;
