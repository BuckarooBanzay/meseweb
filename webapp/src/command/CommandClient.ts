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
    ServerCommand: (c: ServerCommand) => void
    ServerPacket: (p: Packet) => void
}

export class CommandClient {

    peerId = 0
    splitHandler = new SplitPacketHandler()
    events = new EventEmitter() as TypedEmitter<CommandClientEvents>

    ready = new Promise(resolve => {
        Logger.debug("websocket opened")
        this.ws.addEventListener("open", () => resolve(null))
    })

    constructor(public ws: WebSocket) {
        this.events.setMaxListeners(100)
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

    private onMessage(ab: ArrayBuffer) {
        const buf = new Uint8Array(ab);
        const p = unmarshal(buf);
        if (Logger.enabledFor(Logger.TRACE)) {
            Logger.trace(`<<< Received ${buf.length} bytes: ${p}`)
        }
        this.events.emit("ServerPacket", p)

        if (p.packetType == PacketType.Reliable){
            // send ack
            const ack = createAck(p, this.peerId)
            ack.channel = p.channel
            this.sendPacket(ack)

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
                cmd.unmarshalPacket(new DataView(dv.buffer, dv.byteOffset + 2));
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

    close() {
        this.sendPacket(createDisconnect())
        this.ws.close()
    }

    sendPacket(p: Packet, timeout = 2000): Promise<void> {
        p.peerId = this.peerId
        const payload = marshal(p)
        if (Logger.enabledFor(Logger.TRACE)) {
            Logger.trace(`>>> Sent ${payload.length} bytes: ${p}`)
        }
        this.ws.send(payload)

        if (p.packetType == PacketType.Reliable) {
            // wait for ACK
            return new Promise((resolve, reject) => {
                var handle: NodeJS.Timeout

                const listener = (rxp: Packet) => {
                    if (rxp.packetType == PacketType.Control && rxp.controlType == ControlType.Ack && rxp.seqNr == p.seqNr) {
                        this.events.off("ServerPacket", listener)
                        clearTimeout(handle)
                        resolve()
                    }
                }

                handle = setTimeout(() => {
                    reject(`Timed out while waiting ${timeout} ms for packet ${p}`)
                    // timed out, clean up
                    this.events.off("ServerPacket", listener)
                }, timeout)

                this.events.on("ServerPacket", listener)

            })
        } else {
            return Promise.resolve()
        }
    }

    sendCommand(cmd: ClientCommand, type = PacketType.Reliable, timeout = 2000): Promise<void[]> {
        const packets = createCommandPacket(cmd, this.peerId, type || PacketType.Reliable);
        const promises = packets.map(p => this.sendPacket(p, timeout));

        if (cmd instanceof ClientInit){
            setSeqNr(65500-1);
        }

        return Promise.all(promises)
    }

    peerInit(timeout = 2000): Promise<void> {
        return new Promise((resolve, reject) => {
            this.sendPacket(createPeerInit())
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
                reject(`Timed out while waiting ${timeout} ms for peer-init`)
                // timed out, clean up
                this.events.off("ServerPacket", listener)
            }, timeout)

            this.events.on("ServerPacket", listener)
        })
    }

    waitForCommand<T>(t: new() => T, timeout = 2000): Promise<T> {
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
                reject(`Timed out while waiting ${timeout} ms for ${t}`)
                // timed out, clean up
                this.events.off("ServerCommand", listener)
            }, timeout)

            this.events.on("ServerCommand", listener)
        })
    }

    exchangeCommand<T>(cmd: ClientCommand, type = PacketType.Reliable, t: new() => T, timeout = 2000): Promise<T> {
        const p = this.waitForCommand(t)
        this.sendCommand(cmd, type, timeout)
        return p
    }
}