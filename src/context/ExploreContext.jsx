import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ExploreContext = createContext(null);

export function ExploreProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  const [zoneId, setZoneId] = useState(null);
  const [history, setHistory] = useState([]);

  const record = useCallback((entry) => {
    setHistory((h) => [...h.slice(-11), entry]);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      zoneId,
      history,
      setSelectedId,
      setZoneId,
      record,
    }),
    [selectedId, zoneId, history, record]
  );

  return <ExploreContext.Provider value={value}>{children}</ExploreContext.Provider>;
}

export function useExplore() {
  const ctx = useContext(ExploreContext);
  if (!ctx) throw new Error("useExplore must be inside ExploreProvider");
  return ctx;
}
