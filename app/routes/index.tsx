import type { LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  return null;
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div className="appbar">
        <h1>Welcome to Remix</h1>
        <Link to="/">Home</Link>
      </div>
      <div className="container">
        <div className="sidebar">
          <div>
            <Link to="/departments">Departments</Link>
          </div>
          <div>
            <Link to="/courses">Courses</Link>
          </div>
          <div>
            <Link to="/students">Students</Link>
          </div>
          <div>
            <Link to="/professors">Professors</Link>
          </div>
          <div>
            <Link to="/registrars">Registrars</Link>
          </div>
        </div>
        <div className="content"></div>
      </div>
    </div>
  );
}
