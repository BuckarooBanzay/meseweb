import { marshal, unmarshal } from "./packet/marshal";
import { Packet } from "./packet/Packet";
import { createAck, createCommandPacket, createDisconnect, createPeerInit } from "./packet/packetfactory";
import { setSeqNr } from "./packet/sequence";
import { SplitPacketHandler } from "./packet/splitpackethandler";
import { ControlType, PacketType } from "./packet/types";
import { ClientInit } from "./client/ClientInit";
import { ClientCommand } from "./ClientCommand";
import { getServerCommand, ServerCommand } from "./ServerCommand";

import Logger from "js-logger"
import EventEmitter from "events"
import TypedEmitter from "typed-emitter"

type CommandClientEvents = {
    Ready: () => void,
    ServerCommand: (c: ServerCommand) => void
    ServerPacket: (p: Packet) => void
}

export const TimeoutError = new Error("timeout")

export class CommandClient {

    peerId = 0
    splitHandler = new SplitPacketHandler()
    events = new EventEmitter() as TypedEmitter<CommandClientEvents>

    constructor(public ws: WebSocket) {
        ws.addEventListener("open", () => this.onOpen())
        ws.addEventListener("message", ev => {
            if (ev.data instanceof Blob) {
                ev.data.arrayBuffer().then(ab => this.onMessage(ab))
            } else if (ev.data instanceof Buffer) {
                this.onMessage(ev.data)
            } else {
                Logger.error("invalid event type: ", ev.data)
            }
        })
    }

    private onOpen() {
        Logger.debug("websocket opened")
        this.events.emit("Ready")
    }

    private onMessage(ab: ArrayBuffer) {
        const buf = new Uint8Array(ab);
        const p = unmarshal(buf);
        Logger.debug(`<<< Received ${buf.length} bytes: ${p}`)
        this.events.emit("ServerPacket", p)

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p, this.peerId)
            ack.channel = p.channel
            this.SendPacket(ack)

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
    }

    private parseCommandPayload(dv: DataView) {
        const cmdId = dv.getUint16(0);
        try {
            const cmd = getServerCommand(cmdId);
            Logger.debug("received command", cmd)
            if (cmd != null){
                cmd.UnmarshalPacket(new DataView(dv.buffer, dv.byteOffset + 2));
                this.events.emit("ServerCommand", cmd)
            } else {
                Logger.debug("Unknown command received: " + cmdId);
            }

        } catch (e) {
            console.error(e);
            Logger.debug("Caught error, aborting");
            this.close();
        }
    }

    OnReady(): Promise<void> {
        return new Promise((resolve) => {
            this.events.once("Ready", resolve)
        })
    }

    close() {
        this.SendPacket(createDisconnect())
        this.ws.close()
    }

    SendPacket(p: Packet) {
        p.peerId = this.peerId
        const payload = marshal(p)
        Logger.debug(`>>> Sent ${payload.length} bytes: ${p}`)
        this.ws.send(payload)
    }

    SendCommand(cmd: ClientCommand, type = PacketType.Reliable) {
        const packets = createCommandPacket(cmd, this.peerId, type || PacketType.Reliable);
        packets.forEach(p => this.SendPacket(p));

        if (cmd instanceof ClientInit){
            setSeqNr(65500-1);
        }
    }

    PeerInit(timeout = 1000): Promise<void> {
        return new Promise((resolve, reject) => {
            this.SendPacket(createPeerInit())
            var handle: NodeJS.Timeout

            const listener = (p: Packet) => {
                if (p.packetType == PacketType.Reliable && p.controlType == ControlType.SetPeerID) {
                    this.peerId = p.peerId
                    Logger.debug("Set peerId to " + this.peerId);
                    this.events.off("ServerPacket", listener)
                    clearTimeout(handle)
                    resolve()
                }
            }

            handle = setTimeout(() => {
                reject(TimeoutError)
                // timed out, clean up
                this.events.off("ServerPacket", listener)
            }, timeout)

            this.events.on("ServerPacket", listener)
        })
    }

    WaitForCommand<T>(t: new() => T, timeout = 1000): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            var handle: NodeJS.Timeout
            const listener = (c: ServerCommand) => {
                if (c instanceof t) {
                    this.events.off("ServerCommand", listener)
                    clearTimeout(handle)
                    resolve(c)
                }
            }
    
            handle = setTimeout(() => {
                reject(TimeoutError)
                // timed out, clean up
                this.events.off("ServerCommand", listener)
            }, timeout)

            this.events.on("ServerCommand", listener)
        })
    }
}