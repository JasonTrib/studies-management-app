import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = {
  departments: [{ name: "IT" }, { name: "GEO" }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  //   const departments = await getDepartments();
  const departments = [{ name: "IT" }, { name: "GEO" }];
  return json({ departments });
};

const DepartmentIndexPage = () => {
  const { departments } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar">
          <Link to="/departments/IT">IT</Link>
        </div>
        <div className="content">
          <div>DepartmentIndexPage</div>
          <div>
            <h2>list of departments</h2>
            {departments.map((x) => (
              <li key={x.name}>
                <Link to={`/departments/${x.name}`}>{x.name}</Link>
              </li>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DepartmentIndexPage;
