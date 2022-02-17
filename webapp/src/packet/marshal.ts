import { Payload } from "./payload"
import { Packet, PacketType, ControlType, ProtocolID } from "./types"

export function marshal(p: Packet): Payload {
    const payload = new Payload()
    for (let i=0; i<ProtocolID.length; i++){
        payload.appendUint8(ProtocolID[i])
    }
    payload.appendUint16(p.peerId)
    payload.appendUint8(p.channel)
    payload.appendUint8(p.packetType || 0)

    switch (p.packetType){
    case PacketType.Control:
        switch (p.controlType){
        case ControlType.Ping:
        case ControlType.Ack:
            payload.appendUint8(p.controlType || 0)
            payload.appendUint16(p.seqNr)
            return payload
        }
    case PacketType.Original:
        payload.appendPayload(p.payload)
        return payload
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