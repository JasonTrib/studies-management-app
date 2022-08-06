import { Link, Links, LiveReload, Meta, Scripts, ScrollRestoration } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/react/routeModules";

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error.message);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="error-page-container">
          <div className="inner-container">
            <div className="status">
              <h2>Status: 500</h2>
            </div>
            <div className="body">
              <div className="message">Unexpected Server Error</div>
              <div className="link">
                <Link to="/">Home</Link>
              </div>
            </div>
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};
