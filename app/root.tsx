import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "~/styles/index.css";
import {
  logUserDAO,
  logCourseDAO,
  logAnnouncementDAO,
  logStudentDAO,
  logProfessorDAO,
  logURegistrarDAO,
} from "./debug/logDAO.server";
export { CatchBoundary } from "~/components/CatchBoundary";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // logUserDAO();
  // logCourseDAO();
  // logAnnouncementDAO();
  // logStudentDAO();
  // logProfessorDAO();
  // logURegistrarDAO();

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
