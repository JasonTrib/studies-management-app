import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { getDepartmentsCount } from "~/DAO/departmentDAO.server";
import { links as IndexLinks } from "~/routes/index";
import errorStyles from "~/styles/error.css";
import styles from "~/styles/global.css";
// import {
//   logUserDAO,
//   logCourseDAO,
//   logAnnouncementDAO,
//   logStudentDAO,
//   logProfessorDAO,
//   logURegistrarDAO,
// } from "./debug/logDAO.server";
export { CatchBoundary } from "~/components/CatchBoundary";
export { ErrorBoundary } from "~/components/ErrorBoundary";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Unilumnus",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: errorStyles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap",
    },
    ...IndexLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // logUserDAO();
  // logCourseDAO();
  // logAnnouncementDAO();
  // logStudentDAO();
  // logProfessorDAO();
  // logURegistrarDAO();

  const departments = await getDepartmentsCount();
  const path = new URL(request.url).pathname;
  const onInitPage = path.match(/^\/initialization/);
  if (!departments) {
    if (!onInitPage) return redirect("/initialization");
  } else {
    if (onInitPage) return redirect("/");
  }
  return null;
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
