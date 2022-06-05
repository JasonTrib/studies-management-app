import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Professor } from "~/models/professor.server";
import { getProfessorProfile } from "~/models/professor.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  professor:
    | (Professor & {
        profile: Profile | null;
      })
    | null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.professorId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const professorRaw = await getProfessorProfile(id);
  // modify professor object: remove professor.user, chain professor.profile
  const { user, ...rest } = { ...professorRaw };
  const professor = {
    ...rest,
    profile: professorRaw?.user.profile,
  } as LoaderData["professor"];

  if (!professor) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ professor });
};

const ProfessorDetailsPage = () => {
  const { professor } = useLoaderData() as LoaderData;
  return (
    <>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar">
          <Link to="/professors">Professors</Link>
        </div>
        <div className="content">
          <div>
            <h2>ProfessorDetailsPage</h2>
            <p>professor id: {professor?.id}</p>
            <p>professor department: {professor?.department}</p>
            <p>professor name: {professor?.profile?.name}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessorDetailsPage;
