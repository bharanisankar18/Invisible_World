import { spawn } from "node:child_process";
import http from "node:http";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = 9222;

const chrome = spawn(CHROME_PATH, [
  "--headless=new",
  `--remote-debugging-port=${CDP_PORT}`,
  "--user-data-dir=C:\\Users\\BHARANI SANKAR\\.gemini\\antigravity-ide\\scratch\\chrome_profile",
  "about:blank",
]);

await new Promise((r) => setTimeout(r, 1500));

async function getWsUrl() {
  for (let i = 0; i < 10; i++) {
    try {
      const url = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${CDP_PORT}/json`, (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => {
            const list = JSON.parse(data);
            resolve(list[0]?.webSocketDebuggerUrl);
          });
        }).on("error", reject);
      });
      if (url) return url;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Could not connect to CDP");
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  ws.send(JSON.stringify({ id: 1, method: "Runtime.enable" }));
  ws.send(JSON.stringify({ id: 2, method: "Log.enable" }));
  ws.send(JSON.stringify({ id: 3, method: "Page.enable" }));
  ws.send(JSON.stringify({ id: 4, method: "Page.navigate", params: { url: "http://localhost:5173/" } }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.method === "Runtime.exceptionThrown") {
    console.error(">>> EXCEPTION DETAILS:", JSON.stringify(msg.params.exceptionDetails, null, 2));
  } else if (msg.method === "Runtime.consoleAPICalled") {
    console.log(">>> CONSOLE:", msg.params.type, msg.params.args.map((a) => a.value || a.description).join(" "));
  }
};

setTimeout(() => {
  ws.close();
  chrome.kill();
  process.exit(0);
}, 6000);
