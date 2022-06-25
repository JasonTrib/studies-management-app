import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import AppSkeleton from "~/components/AppSkeleton";
import { links as AnnouncementLinks } from "~/components/Announcement";

export const loader: LoaderFunction = async ({ request, params }) => {
  return null;
};

export const links: LinksFunction = () => {
  return [...AnnouncementLinks()];
};

export default function Index() {
  return (
    <div className="test">
      <AppSkeleton />
    </div>
  );
}
