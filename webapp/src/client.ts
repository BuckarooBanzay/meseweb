import { ClientInit } from "./commands/client_init";
import { ClientCommand, ServerCommand } from "./commands/command";
import { getServerCommand } from "./commands/server_commands";
import { marshal, setSeqNr, unmarshal } from "./packet/marshal";
import { createAck, createCommandPacket, createPeerInit } from "./packet/packetfactory";
import { SplitPacketHandler } from "./packet/splitpackethandler";
import { ControlType, Packet, PacketType } from "./packet/types";

type CommandHandler = (cmd: ServerCommand) => void
type ReadyHandler = (c: Client) => void

export class Client {
    constructor(private ws: WebSocket){
        ws.addEventListener("message", ev => this.onMessage(ev))
        ws.addEventListener("open", () => this.onOpen())
    }

    peerId = 0
    splitHandler = new SplitPacketHandler()

    onOpen() {
        console.log("websocket opened")
        this.sendPacket(createPeerInit())
        this.readyListeners.forEach(l => l(this))
    }

    async onMessage(ev: MessageEvent<Blob>) {
        const ab: ArrayBuffer = await ev.data.arrayBuffer()
        const buf = new Uint8Array(ab)
        const p = unmarshal(buf)
        console.log("RX>>> " + p, p)

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p, this.peerId)
            this.sendPacket(ack)

            if (p.controlType == ControlType.SetPeerID){
                // set peer id
                this.peerId = p.peerId
                console.log("Set peerId to " + this.peerId)
                return
            }

            if (p.subtype == PacketType.Original){
                this.parseCommandPayload(p.payloadView)
            }

            if (p.subtype == PacketType.Split) {
                const payload = this.splitHandler.AddSplitPacket(p)
                if (payload != null) {
                    // all split parts arrived
                    this.parseCommandPayload(new DataView(payload.buffer))
                }
            }
        }
    }

    parseCommandPayload(dv: DataView){
        const cmdId = dv.getUint16(0)
            
        const cmd = getServerCommand(cmdId)
        if (cmd != null){
            cmd.UnmarshalPacket(new DataView(dv.buffer, dv.byteOffset + 2))
            this.onCommandReceived(cmd)
        } else {
            console.log("Unknown command received: " + cmdId)
        }
    }

    onCommandReceived(cmd: ServerCommand){
        this.commandListeners.forEach(l => l(cmd))
    }

    sendPacket(p: Packet){
        p.peerId = this.peerId

        //TODO: track reliable seqNr
        console.log("TX<<< " + p, p)
        this.ws.send(marshal(p))
    }

    sendCommand(cmd: ClientCommand, type?: PacketType) {
        const packets = createCommandPacket(cmd, this.peerId, type || PacketType.Reliable)
        packets.forEach(p => this.sendPacket(p))

        if (cmd instanceof ClientInit){
            setSeqNr(65500-1)
        }
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