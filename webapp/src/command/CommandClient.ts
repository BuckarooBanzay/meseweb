import { marshal, unmarshal } from "../packet/marshal";
import { Packet } from "../packet/Packet";
import { createAck, createCommandPacket, createDisconnect } from "../packet/packetfactory";
import { setSeqNr } from "../packet/sequence";
import { SplitPacketHandler } from "../packet/splitpackethandler";
import { ControlType, PacketType } from "../packet/types";
import { ClientInit } from "./client/ClientInit";
import { ClientCommand } from "./ClientCommand";
import { getServerCommand, ServerCommand } from "./ServerCommand";

import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type CommandClientEvents = {
    Ready: () => void,
    ServerCommand: (c: ServerCommand) => void
}

export class CommandClient {

    peerId = 0
    splitHandler = new SplitPacketHandler()
    events = new EventEmitter() as TypedEmitter<CommandClientEvents>

    constructor(public ws: WebSocket) {
        ws.addEventListener("open", () => this.onOpen())
        ws.addEventListener("message", ev => this.onMessage(ev))
    }

    private onOpen() {
        console.log("websocket opened")
        this.events.emit("Ready")
    }

    private onMessage(ev: MessageEvent<Blob>) {
        console.log(ev.data)
        ev.data.arrayBuffer().then(ab => {
            const buf = new Uint8Array(ab);
            const p = unmarshal(buf);

            if (p.packetType == PacketType.Reliable){
                // send ack
                const ack = createAck(p, this.peerId)
                ack.channel = p.channel
                this.SendPacket(ack)

                if (p.controlType == ControlType.SetPeerID){
                    // set peer id
                    this.peerId = p.peerId;
                    console.log("Set peerId to " + this.peerId);
                    return;
                }
    
                if (p.subType == PacketType.Original){
                    this.parseCommandPayload(p.payloadView);
                }
    
                if (p.subType == PacketType.Split) {
                    const payload = this.splitHandler.AddSplitPacket(p);
                    if (payload != null) {
                        // all split parts arrived
                        this.parseCommandPayload(new DataView(payload.buffer));
                    }
                }
            }
        })
    }

    private parseCommandPayload(dv: DataView) {
        if (this.ws.readyState != WebSocket.OPEN){
            return;
        }

        const cmdId = dv.getUint16(0);
        try {
            const cmd = getServerCommand(cmdId);
            if (cmd != null){
                cmd.UnmarshalPacket(new DataView(dv.buffer, dv.byteOffset + 2));
                this.events.emit("ServerCommand", cmd)
            } else {
                console.log("Unknown command received: " + cmdId);
            }

        } catch (e) {
            console.error(e);
            console.log("Caught error, aborting");
            this.close();
        }
    }

    close() {
        this.SendPacket(createDisconnect())
        this.ws.close()
    }

    SendPacket(p: Packet) {
        p.peerId = this.peerId
        this.ws.send(marshal(p))
    }

    SendCommand(cmd: ClientCommand, type = PacketType.Reliable) {
        const packets = createCommandPacket(cmd, this.peerId, type || PacketType.Reliable);
        packets.forEach(p => this.SendPacket(p));

        if (cmd instanceof ClientInit){
            setSeqNr(65500-1);
        }
    }

    WaitForCommand() {
        //TODO
    }
}