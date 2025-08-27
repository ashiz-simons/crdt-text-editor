import http from "http"
import WebSocket from "ws"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { setupWSConnection } = require("y-websocket/server.js")

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("✅ Yjs WebSocket Server is running")
})

// Attach WebSocket server
const wss = new WebSocket.Server({ server })

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req)
})

// Use Render's provided PORT or default to 1234 for local dev
const PORT = process.env.PORT || 1234

// Bind to 0.0.0.0 so Render detects the port
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ WebSocket server running at http://0.0.0.0:${PORT}`)
})
