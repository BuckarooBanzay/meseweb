import { ClientCommand, ServerCommand } from "./commands/command";
import { getServerCommand } from "./commands/server_commands";
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
        const ab: ArrayBuffer = await ev.data.arrayBuffer()
        const buf = new Uint8Array(ab)
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
                return
            }
        }

        if (p.packetType == PacketType.Reliable && p.subtype == PacketType.Original){
            const cmdId = p.payloadView.getUint16(0)
            
            const cmd = getServerCommand(cmdId)
            if (cmd != null){
                cmd.UnmarshalPacket(new DataView(p.payloadView.buffer, p.payloadView.byteOffset + 2))
                this.onCommandReceived(cmd)
            } else {
                console.log("Unknown command received: " + cmdId)
            }
        }
    }

    onCommandReceived(cmd: ServerCommand){
        this.commandListeners.forEach(l => l(cmd))
    }

    sendPacket(p: Packet){
        if (p.seqNr == 0){
            p.seqNr = this.getNextSeqNr()
        }
        console.log("TX<<< " + JSON.stringify(p))
        this.ws.send(marshal(p))
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