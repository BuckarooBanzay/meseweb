
import * as srp from "secure-remote-password/client"
import { Client } from "./client"
import { ClientInit } from "./commands/client_init"
import { ServerHello } from "./commands/server_hello"

console.log("ok", srp)

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

const client = new Client(ws)
client.addReadyListener(function(c){
    setTimeout(function(){
        console.log("Sending INIT")
        c.sendCommand(new ClientInit("test"))
    }, 1000)
})

client.addCommandListener(function(cmd){
    if (cmd instanceof ServerHello){
        console.log("Got server hello")
    }
})