
import * as srp from "secure-remote-password/client"
import { MinetestClient } from "./minetestclient"

console.log("ok", srp)

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

const client = new MinetestClient(ws)
