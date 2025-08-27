import { spawn } from "child_process";

const port = process.env.PORT || 1234;   // Render injects PORT, local defaults to 1234
const host = "0.0.0.0";                  // Must bind to all interfaces

console.log(`🚀 Starting y-websocket-server on ${host}:${port}`);

const child = spawn("y-websocket-server", [
  "--port", port,
  "--host", host
], {
  stdio: "inherit",
  env: {
    ...process.env,
    HOST: host   // Force host for y-websocket-server
  },
  shell: true
});

child.on("close", (code) => {
  console.log(`❌ y-websocket-server exited with code ${code}`);
});
