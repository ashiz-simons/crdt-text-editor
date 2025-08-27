import http from "http"
import WebSocket from "ws"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const { setupWSConnection } = require("y-websocket/server.js")

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("Yjs WebSocket Server is running")
})

const wss = new WebSocket.Server({ server })

wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req)
})

const PORT = process.env.PORT || 1234
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`)
})
