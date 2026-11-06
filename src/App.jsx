import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ExploreProvider } from "./context/ExploreContext.jsx";
import Layout from "./components/Layout.jsx";
import Landing from "./pages/Landing.jsx";
import Zones from "./pages/Zones.jsx";
import Zone from "./pages/Zone.jsx";
import ObjectDetail from "./pages/ObjectDetail.jsx";
import ScaleExplorer from "./pages/ScaleExplorer.jsx";
import Mystery from "./pages/Mystery.jsx";
import Compare from "./pages/Compare.jsx";
import Ask from "./pages/Ask.jsx";
import Search from "./pages/Search.jsx";
import NotFound from "./pages/NotFound.jsx";

// three.js is ~1 MB; only load it on the 3D routes.
const Explorer3D = lazy(() => import("./pages/Explorer3D.jsx"));
const AtomLab = lazy(() => import("./pages/AtomLab.jsx"));

const Loading = ({ what }) => (
  <div className="flex min-h-[60dvh] items-center justify-center">
    <p className="text-muted" role="status">
      Loading {what}…
    </p>
  </div>
);

export default function App() {
  return (
    <ExploreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/atom"
            element={
              <Suspense fallback={<Loading what="the atom lab" />}>
                <AtomLab />
              </Suspense>
            }
          />
          <Route path="/zones" element={<Zones />} />
          <Route path="/zone/:zoneId" element={<Zone />} />
          <Route path="/object/:id" element={<ObjectDetail />} />
          <Route path="/scale" element={<ScaleExplorer />} />
          <Route path="/mystery" element={<Mystery />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/3d" element={<Navigate to="/atom" replace />} />
          <Route path="/3d/atom" element={<Navigate to="/atom" replace />} />
          <Route
            path="/3d/:id"
            element={
              <Suspense fallback={<Loading what="the 3D viewer" />}>
                <Explorer3D />
              </Suspense>
            }
          />
          <Route path="/ask" element={<Ask />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ExploreProvider>
  );
}
