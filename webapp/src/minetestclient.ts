import { ClientInit } from "./commands/client_init";
import { Command } from "./commands/command";
import { marshal, unmarshal } from "./packet/marshal";
import { createAck, createOriginal } from "./packet/packetfactory";
import { ControlType, PacketType } from "./packet/types";

export class MinetestClient {
    constructor(private ws: WebSocket){
        ws.addEventListener("message", ev => this.onMessage(ev))
        ws.addEventListener("open", () => this.onOpen())
    }

    peerId = 0

    onOpen() {
        console.log("websocket opened")

        const pkg = createOriginal(new ClientInit("test"))
        this.ws.send(marshal(pkg).toUint8Array())
    }

    async onMessage(ev: MessageEvent<any>) {
        const buf: Uint8Array = await ev.data.arrayBuffer()
        const p = unmarshal(buf)
        console.log("rx-packet", p.toString())

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p)
            ack.peerId = 0
            console.log("tx-packet", ack)
            this.ws.send(marshal(ack).toUint8Array())

            if (p.controlType == ControlType.SetPeerID){
                // set peer id
                this.peerId = p.peerId
                console.log("Set peerId to " + this.peerId)

                setTimeout(() => {
                    const pkg = createOriginal(new ClientInit("test"))
                    pkg.peerId = this.peerId
                    console.log("Sending: " + pkg)
                    this.ws.send(marshal(pkg).toUint8Array())
                }, 1000)
            }
        }
    }

    sendCommand(cmd: Command) {

    }
}