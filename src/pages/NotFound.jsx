import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-[50dvh] flex-col items-start justify-center">
      <p className="eyebrow">404 · {pathname}</p>
      <h1 className="display mt-4 text-5xl">Smaller than this site can resolve</h1>
      <p className="mt-4 text-muted">No page lives at that address.</p>
      <Link to="/zones" className="btn-primary mt-8">
        Back to the five zones
      </Link>
    </div>
  );
}
