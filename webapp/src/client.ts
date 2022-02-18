import { ClientCommand, ServerCommand } from "./commands/command";
import { ServerHello } from "./commands/server_hello";
import { ServerSRPBytesSB } from "./commands/server_srp_bytes_s_b";
import { ServerTimeOfDay } from "./commands/server_time_of_day";
import { marshal, unmarshal } from "./packet/marshal";
import { createAck, createOriginal, createPeerInit, createPing } from "./packet/packetfactory";
import { ControlType, Packet, PacketType } from "./packet/types";

type CommandHandler = (cmd: ServerCommand) => void
type ReadyHandler = (c: Client) => void

export class Client {
    constructor(private ws: WebSocket){
        ws.addEventListener("message", ev => this.onMessage(ev))
        ws.addEventListener("open", () => this.onOpen())
    }

    peerId = 0
    seqNr = 65500

    getNextSeqNr(): number {
        if (this.seqNr >= 65535){
            this.seqNr = 0
        } else {
            this.seqNr++
        }
        return this.seqNr
    }

    onOpen() {
        console.log("websocket opened")
        this.sendPacket(createPeerInit())
        this.readyListeners.forEach(l => l(this))
    }

    async onMessage(ev: MessageEvent<any>) {
        const buf: Uint8Array = await ev.data.arrayBuffer()
        const p = unmarshal(buf)
        console.log("RX>>> " + JSON.stringify(p))

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p)
            ack.peerId = 0
            this.sendPacket(ack)

            if (p.controlType == ControlType.SetPeerID){
                // set peer id
                this.peerId = p.peerId
                console.log("Set peerId to " + this.peerId)
            }
        }

        const cmdId = p.payload.getUint16(0)
        var cmd: ServerCommand|null = null
        switch (cmdId){
            case 0x02:
                cmd = new ServerHello()
                cmd.UnmarshalPacket(p.payload.subPayload(2))
                break
            case 0x60:
                cmd = new ServerSRPBytesSB()
                cmd.UnmarshalPacket(p.payload.subPayload(2))
                break
            case 0x29:
                cmd = new ServerTimeOfDay()
                cmd.UnmarshalPacket(p.payload.subPayload(2))
                break
        }
        if (cmd != null) {
            this.onCommandReceived(cmd)
        }

        // TODO: parse server command and emit events
    }

    onCommandReceived(cmd: ServerCommand){
        this.commandListeners.forEach(l => l(cmd))
    }

    sendPacket(p: Packet){
        if (p.seqNr == 0){
            p.seqNr = this.getNextSeqNr()
        }
        console.log("TX<<< " + JSON.stringify(p))
        this.ws.send(marshal(p).toUint8Array())
    }

    sendCommand(cmd: ClientCommand) {
        const pkg = createOriginal(cmd)
        pkg.peerId = this.peerId
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