
import * as srp from "secure-remote-password/client"
import { ClientInit } from "./commands/client_init"
import { marshal, unmarshal } from "./packet/marshal"
import { createPing, createAck, createOriginal } from "./packet/packetfactory"
import { PacketType } from "./packet/types"

console.log("ok", srp)

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

ws.addEventListener("open", function(){
    const hello = createOriginal(new ClientInit("test"))
    ws.send(marshal(hello).toUint8Array())
})

ws.addEventListener("message", async function(event){
    const buf: Uint8Array = await event.data.arrayBuffer()
    const p = unmarshal(buf)
    console.log("rx-packet", p.toString())

    if (p.packetType == PacketType.Reliable){
        // send ack
        const ack = createAck(p)
        ack.peerId = 0
        console.log("tx-packet", ack.toString())
        ws.send(marshal(ack).toUint8Array())
    }
})
