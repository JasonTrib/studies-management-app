import type { LoaderFunction } from "@remix-run/node";
import AppSkeleton from "~/components/AppSkeleton";

export const loader: LoaderFunction = async ({ request, params }) => {
  return null;
};

export default function Index() {
  return (
    <div>
      <AppSkeleton />
    </div>
  );
}
