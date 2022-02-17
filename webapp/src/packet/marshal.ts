import { Packet, PacketType, ControlType, ProtocolID } from "./types"

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