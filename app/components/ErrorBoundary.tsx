import { Link, Links, LiveReload, Meta, Scripts, ScrollRestoration } from "@remix-run/react";

export function ErrorBoundary({ error }: any) {
  console.error(error);

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
}
