import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Page from "~/components/layout/Page";
import type { UserModelT } from "~/DAO/userDAO.server";
import { getProfessorsCount, getRegistrarsCount, getStudentsCount } from "~/DAO/userDAO.server";
import { USER_ROLE } from "~/data/data";
import usersStyles from "~/styles/users.css";
import { bc_users } from "~/utils/breadcrumbs";
import { logout, requireUser } from "~/utils/session.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: usersStyles }];
};

type LoaderDataT = {
  breadcrumbData: Awaited<ReturnType<typeof bc_users>>;
  regCount: Awaited<ReturnType<typeof getRegistrarsCount>>;
  profCount: Awaited<ReturnType<typeof getProfessorsCount>>;
  studCount: Awaited<ReturnType<typeof getStudentsCount>>;
  userRole: UserModelT["role"];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request);
  if (user === null) return logout(request);

  const path = new URL(request.url).pathname;
  const breadcrumbData = await bc_users(path);
  const regCount = await getRegistrarsCount(user.dep_id);
  const profCount = await getProfessorsCount(user.dep_id);
  const studCount = await getStudentsCount(user.dep_id);

  return { breadcrumbData, regCount, profCount, studCount, userRole: user.role };
};

const UsersIndexPage = () => {
  const { breadcrumbData, regCount, profCount, studCount, userRole } =
    useLoaderData() as LoaderDataT;
  const isSup = userRole === USER_ROLE.SUPERADMIN;
  const isReg = userRole === USER_ROLE.REGISTRAR;
  const data = [
    { title: "Registrars", path: "registrars", count: regCount, showAddNew: isSup },
    { title: "Professors", path: "professors", count: profCount, showAddNew: isSup || isReg },
    { title: "Students", path: "students", count: studCount, showAddNew: isSup || isReg },
  ];

  return (
    <Page breadcrumbs={breadcrumbData}>
      <>
        {data.map((x) => (
          <div className="users-container" key={x.title}>
            <div className="title">
              {x.title} <span className="count">({x.count})</span>
            </div>
            <div className="content">
              <div className="link">
                <Link to={`/users/${x.path}`}>View all</Link>
              </div>
              {x.showAddNew && (
                <div className="link">
                  <Link to={`/users/${x.path}/new`}>Add new</Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    </Page>
  );
};

export default UsersIndexPage;
