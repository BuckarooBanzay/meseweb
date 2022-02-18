
export const ProtocolID = [0x4f, 0x45, 0x74, 0x03]

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
    payload = new Uint8Array(0)
    payloadView = new DataView(this.payload.buffer)

    toString(): string {
        return `Packet{type=${PacketType[this.packetType || 0]},`+
            `control=${ControlType[this.controlType || 0]},`+
            `subType=${PacketType[this.subtype || 0]},`+
            `peerId=${this.peerId},`+
            `seqNr=${this.seqNr}`+
            `}`
    }
}
