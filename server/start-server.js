import { spawn } from "child_process";

const port = process.env.PORT || 1234;   // Render injects PORT, local defaults to 1234
const host = "0.0.0.0";                  // Bind to all interfaces

console.log(`🚀 Starting y-websocket-server on ${host}:${port}`);

const child = spawn("y-websocket-server", ["--port", port, "--host", host], {
  stdio: "inherit",
  shell: true
});

child.on("close", (code) => {
  console.log(`❌ y-websocket-server exited with code ${code}`);
});
