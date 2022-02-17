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
    case PacketType.Reliable:
        payload.appendUint16(p.seqNr)
        payload.appendUint8(p.subtype || 0)
        payload.appendPayload(p.payload)
        return payload
    }

    throw new Error("not implemented yet")
}

export function unmarshal(buf: Uint8Array): Packet {
    if (buf.byteLength < 5) {
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
        case PacketType.Original:
            const cmdPayload = new Array(buf.byteLength - 11)
            for (let i=11; i<buf.length; i++){
                cmdPayload[i-11] = dv.getUint8(i);
            }
            p.payload = new Payload(cmdPayload)
            return p
        }
    case PacketType.Control:
        //TODO
        return p
    }

    throw new Error(`not implemented yet: packetType: ${p.packetType}, subtype: ${p.subtype}, controlType: ${p.controlType}, data: ${dumpPacket(buf)}`)
}

function dumpPacket(buf: Uint8Array): string {
    let str = ""
    const dv = new DataView(buf)
    for (let i=0; i<dv.byteLength; i++){
        str += "0x" + dv.getUint8(i).toString(16) + ","
    }
    return str
}