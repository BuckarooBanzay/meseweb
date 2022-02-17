import { Payload } from "./payload"

const ProtocolID = [0x4f, 0x45, 0x74, 0x03]

export enum PacketType {
    Control = 0x00,
    Original = 0x01,
    Split = 0x02,
    Reliable = 0x03
}

export enum ControlType {
    Ack = 0x00,
    SetPeerID = 0x01,
    Ping = 0x02,
    Disco = 0x03
}

export class Packet {
    packetType?: PacketType
    controlType?: ControlType
    subtype?: PacketType
    peerId = 0
    seqNr = 0
    channel = 0
    payload = new Payload()

    toString(): string {
        return `Packet{type=${PacketType[this.packetType || 0]}, control=${ControlType[this.controlType || 0]}}`
    }
}

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

export function marshal(p: Packet): Uint8Array {
    if (p.packetType == PacketType.Control){
        switch (p.controlType){
        case ControlType.Ping:
        case ControlType.Ack:
                const buffer = new ArrayBuffer(11)
            const dv = new DataView(buffer)
            for (let i=0; i<ProtocolID.length; i++){
                dv.setUint8(i, ProtocolID[i])
            }

            dv.setUint16(4, p.peerId)
            dv.setUint8(6, p.channel)
            dv.setUint8(7, p.packetType)
            dv.setUint8(8, p.controlType)
            dv.setUint16(9, p.seqNr)

            return new Uint8Array(buffer)
        }
    }

    throw new Error("not implemented yet")
}

export function unmarshal(buf: Uint8Array): Packet {
    if (buf.length < 5) {
        throw new Error("invalid packet length")
    }

    const dv = new DataView(buf)

    for (let i=0; i<ProtocolID.length; i++){
        if (dv.getUint8(i) != ProtocolID[i]){
            throw new Error("invalid protocol id")
        }
    }

    const p = new Packet()
    p.peerId = dv.getUint16(4)
    p.channel = dv.getUint8(6)
    p.packetType = dv.getUint8(7)
    
    switch (p.packetType){
    case PacketType.Reliable:
        p.seqNr = dv.getUint16(8)
        p.subtype = dv.getUint8(10)

        switch (p.subtype){
        case PacketType.Control:
            p.controlType = dv.getUint8(11)
            if (p.controlType == ControlType.SetPeerID) {
                p.peerId = dv.getUint16(12)
            }
            return p
        }
    }

    throw new Error("not implemented yet")
}