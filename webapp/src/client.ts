import { ClientCommand, ServerCommand } from "./commands/command";
import { ServerHello } from "./commands/server_hello";
import { marshal, unmarshal } from "./packet/marshal";
import { createAck, createOriginal, createPing } from "./packet/packetfactory";
import { ControlType, Packet, PacketType } from "./packet/types";

type CommandHandler = (cmd: ServerCommand) => void
type ReadyHandler = (c: Client) => void

export class Client {
    constructor(private ws: WebSocket){
        ws.addEventListener("message", ev => this.onMessage(ev))
        ws.addEventListener("open", () => this.onOpen())
    }

    peerId = 0

    onOpen() {
        console.log("websocket opened")
        const ping = createPing()
        this.ws.send(marshal(ping).toUint8Array())
        this.readyListeners.forEach(l => l(this))
    }

    async onMessage(ev: MessageEvent<any>) {
        const buf: Uint8Array = await ev.data.arrayBuffer()
        console.log("rx-data", buf)
        const p = unmarshal(buf)
        console.log("rx-packet: " + p.toString())

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p)
            ack.peerId = 0
            console.log("tx-packet: " + ack)
            this.ws.send(marshal(ack).toUint8Array())

            if (p.controlType == ControlType.SetPeerID){
                // set peer id
                this.peerId = p.peerId
                console.log("Set peerId to " + this.peerId)
            }
        }

        const cmdId = p.payload.getUint16(0)
        switch (cmdId){
            case 0x02:
                const cmd = new ServerHello()
                cmd.UnmarshalPacket(p.payload.subPayload(2))
                this.onCommandReceived(cmd)
        }

        // TODO: parse server command and emit events
    }

    onCommandReceived(cmd: ServerCommand){
        this.commandListeners.forEach(l => l(cmd))
    }

    sendPacket(p: Packet){
        console.log("tx-packet: " + p)
        this.ws.send(marshal(p).toUint8Array())
    }

    sendCommand(cmd: ClientCommand) {
        const pkg = createOriginal(cmd)
        pkg.peerId = this.peerId
        //TODO: seqNr
        this.sendPacket(pkg)
    }

    commandListeners = new Array<CommandHandler>()
    addCommandListener(h: CommandHandler) {
        this.commandListeners.push(h)
    }

    readyListeners = new Array<ReadyHandler>()
    addReadyListener(h: ReadyHandler){
        this.readyListeners.push(h)
    }
}