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
import Explorer3D from "./pages/Explorer3D.jsx";
import Ask from "./pages/Ask.jsx";
import Search from "./pages/Search.jsx";

export default function App() {
  return (
    <ExploreProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/zone/:zoneId" element={<Zone />} />
          <Route path="/object/:id" element={<ObjectDetail />} />
          <Route path="/scale" element={<ScaleExplorer />} />
          <Route path="/mystery" element={<Mystery />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/3d" element={<Navigate to="/3d/atom" replace />} />
          <Route path="/3d/:id" element={<Explorer3D />} />
          <Route path="/ask" element={<Ask />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </ExploreProvider>
  );
}
