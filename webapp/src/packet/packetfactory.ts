import { Packet, ControlType, PacketType } from "./types"
import { ClientCommand } from "../commands/command"
import { Payload } from "./payload"

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
    p.payload = new Payload()
    p.payload.appendUint16(0)
    return p
}

export function createOriginal(cmd: ClientCommand): Packet {
    const payload = new Payload()
    payload.appendUint16(cmd.GetCommandID())
    payload.appendPayload(cmd.MarshalPacket())

    const p = new Packet()
    p.packetType = PacketType.Original
    p.payload = payload
    p.channel = 1
    p.peerId = 0 // TODO
    p.seqNr = 0 // TODO
    return p
}