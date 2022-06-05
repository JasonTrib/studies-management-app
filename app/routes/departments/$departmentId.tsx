import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const dep = params.departmentId;

  return json(dep);
};

const DepartmentDetailsPage = () => {
  const dep = useLoaderData();

  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar"></div>
        <div className="content">
          <div>DepartmentDetailsPage</div>
          <div>
            <h2>department</h2>
            <p>{dep}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentDetailsPage;
