import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getDepartments } from "~/DAO/departmentDAO";
import type { DepartmentModelT } from "~/DAO/departmentDAO";
import AppLayout from "~/components/AppLayout";

type LoaderData = {
  departments: DepartmentModelT[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const departments = await getDepartments();
  return json({ departments });
};

const DepartmentIndexPage = () => {
  const { departments } = useLoaderData() as LoaderData;
  return (
    <AppLayout>
      <div>DepartmentIndexPage</div>
      <div>
        <h2>list of departments</h2>
        {departments.map((x) => (
          <li key={x.title_id}>
            <Link to={`/departments/${x.title_id}`}>{x.full_title}</Link>
          </li>
        ))}
      </div>
    </AppLayout>
  );
};

export default DepartmentIndexPage;
