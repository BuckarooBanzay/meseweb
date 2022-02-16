
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

export function CreatePing(): Packet {
    const p = new Packet(PacketType.Control)
    p.controlType = ControlType.Ping
    return p
}

export class Packet {
    controlType?: ControlType
    subtype?: PacketType
    peerId = 0
    seqNr = 0
    channel = 0

    constructor(private packetType: PacketType){
    }

    Marshal(): Uint8Array {
        if (this.packetType == PacketType.Control){
            if (this.controlType == ControlType.Ping){
                const buffer = new ArrayBuffer(11)
                const dv = new DataView(buffer)
                for (let i=0; i<ProtocolID.length; i++){
                    dv.setUint8(i, ProtocolID[i])
                }

                dv.setUint16(4, this.peerId)
                dv.setUint8(6, this.channel)
                dv.setUint8(7, this.packetType)
                dv.setUint8(8, this.controlType)
                dv.setUint16(9, this.seqNr)

                return new Uint8Array(buffer)
            }
        }

        throw new Error("not implemented yet")
    }
}

