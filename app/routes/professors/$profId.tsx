import type { LoaderFunction } from "@remix-run/node";
import type { ProfileModelT } from "~/DAO/userDAO.server";
import type { ProfessorModelT } from "~/DAO/professorDAO.server";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { getProfessorProfile } from "~/DAO/professorDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderData = {
  professor: ProfessorModelT & {
    user: {
      profile: ProfileModelT | null;
      dep_id: string;
    };
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.profId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const professor = await getProfessorProfile(id);

  if (!professor) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ professor });
};

const ProfessorDetailsPage = () => {
  const { professor } = useLoaderData() as LoaderData;
  return (
    <AppLayout>
      <div>
        <h2>ProfessorDetailsPage</h2>
        <p>professor id: {professor.id}</p>
        <p>professor department: {professor.user.dep_id}</p>
        <p>professor name: {professor.user.profile?.name}</p>
      </div>
    </AppLayout>
  );
};

export default ProfessorDetailsPage;
