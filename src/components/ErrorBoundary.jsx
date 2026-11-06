import { Component } from "react";
import { Link } from "react-router-dom";

/** Keeps a failed route (e.g. a lazy chunk that didn't load) from blanking the whole app. */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-[40dvh] flex-col items-start justify-center" role="alert">
        <h1 className="display text-4xl">This page didn’t load.</h1>
        <p className="mt-4 max-w-[54ch] text-muted">{String(this.state.error?.message || this.state.error)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
            Reload the page
          </button>
          <Link to="/" className="btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    );
  }
}
