import { createServer } from "vite";
import React from "react";
import ReactDOMServer from "react-dom/server";

async function test() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    ssr: {
      noExternal: ["react-router-dom", "react-router", "framer-motion"],
    },
  });

  try {
    const { default: App } = await vite.ssrLoadModule("/src/App.jsx");
    const { MemoryRouter } = await vite.ssrLoadModule("react-router-dom");
    console.log("App module loaded. Now rendering...");
    const html = ReactDOMServer.renderToString(
      React.createElement(MemoryRouter, { initialEntries: ["/"] }, React.createElement(App))
    );
    console.log("SUCCESS! Rendered HTML length:", html.length);
    console.log("Snippet:", html.substring(0, 300));
  } catch (err) {
    console.error(">>> RENDER ERROR CAUGHT <<<");
    console.error(err);
  } finally {
    await vite.close();
  }
}

test();
