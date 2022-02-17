import { Packet, ControlType, PacketType } from "./types"

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