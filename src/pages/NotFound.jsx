import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-[50dvh] flex-col items-start justify-center">
      <h1 className="display text-[clamp(2.5rem,1.6rem+3vw,4.5rem)]">Too small to find</h1>
      <p className="mt-4 max-w-[50ch] text-lg text-muted">
        There’s no page at <span className="text-ink">{pathname}</span>. Check the address, or start again from home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/" className="btn-primary">
          Go home
        </Link>
        <Link to="/atom" className="btn-secondary">
          Open the atom lab
        </Link>
      </div>
    </div>
  );
}
