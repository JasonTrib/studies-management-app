import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Professor } from "~/models/professor.server";
import { getAllProfessors } from "~/models/professor.server";

type LoaderData = {
  professors: Professor[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const professors = await getAllProfessors();
  return json<LoaderData>({ professors });
};

const ProfessorsIndexPage = () => {
  const { professors } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar"></div>
        <div className="content">
          <div>ProfessorsIndexPage</div>
          <div>
            <h2>list of professors</h2>
            <ul>
              {professors.map((x) => (
                <li key={x.id}>
                  <Link to={`/professors/${x.id}`}>{x.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessorsIndexPage;
