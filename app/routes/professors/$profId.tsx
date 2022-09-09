import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/AppLayout";
import { getProfessorId, getProfessorProfile } from "~/DAO/professorDAO.server";
import { paramToInt } from "~/utils/paramToInt";
import { logout, requireUser } from "~/utils/session.server";

type LoaderDataT = {
  professor: Exclude<Awaited<ReturnType<typeof getProfessorProfile>>, null>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const id = paramToInt(params.profId);
  if (id == null) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  if (user === null) return logout(request);

  const profId = await getProfessorId(user.id);
  if (profId?.id === id) return redirect("/profile");

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
