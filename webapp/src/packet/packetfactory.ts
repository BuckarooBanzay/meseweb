import { Packet, ControlType, PacketType, MaxPacketLength } from "./types"
import { ClientCommand } from "../commands/command"
import { splitPayload } from "./splitter"

export function createPing(): Packet {
    const p = new Packet()
    p.packetType = PacketType.Control
    p.controlType = ControlType.Ping
    return p
}

export function createAck(srcp: Packet): Packet {
    const p = new Packet()
    p.packetType = PacketType.Control
    p.controlType = ControlType.Ack
    p.peerId = srcp.peerId
    p.seqNr = srcp.seqNr
    return p
}

export function createPeerInit(): Packet {
    const p = new Packet()
    p.packetType = PacketType.Reliable
    p.subtype = PacketType.Original
    p.channel = 0
    p.payload = new Uint8Array(1)
    return p
}

export function createOriginal(cmd: ClientCommand, peerId: number): Packet[] {
    const commandPayload = cmd.MarshalPacket()
    const payload = new Uint8Array(2 + commandPayload.length)
    const dv = new DataView(payload.buffer)
    dv.setUint16(0, cmd.GetCommandID())
    payload.set(commandPayload, 2)

    if (payload.length > MaxPacketLength) {
        // split into multiple packets
        const packets = splitPayload(payload)
        packets.forEach(p => {
            p.peerId = peerId
            p.channel = 1
        })

        return packets
    }

    // just a single packet
    const p = new Packet()
    p.packetType = PacketType.Original
    p.payload = payload
    p.channel = 1
    p.peerId = peerId
    return [p]
}