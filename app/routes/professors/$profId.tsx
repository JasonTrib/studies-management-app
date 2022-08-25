import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { getProfessorProfile } from "~/DAO/professorDAO.server";
import { paramToInt } from "~/utils/paramToInt";

type LoaderDataT = {
  professor: Exclude<Awaited<ReturnType<typeof getProfessorProfile>>, null>;
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
  const { professor } = useLoaderData() as LoaderDataT;
  return (
    <AppLayout>
      <div>
        <h2>ProfessorDetailsPage</h2>
        <p>professor id: {professor.id}</p>
        <p>professor department: {professor.user.dep_id}</p>
        <p>professor name: {professor.user.profile?.fullname}</p>
      </div>
    </AppLayout>
  );
};

export default ProfessorDetailsPage;
