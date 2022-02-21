
export const MaxPacketLength = 495

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
    packetType: PacketType = 0
    controlType: ControlType = 0
    subtype: PacketType = 0
    peerId = 0
    seqNr = 0
    channel = 0
    payload = new Uint8Array(0)
    payloadView = new DataView(this.payload.buffer)

    dumpPayload(): number[] {
        const a = new Array<number>(this.payloadView.byteLength)
        for (let i=0; i<this.payloadView.byteLength; i++){
            a[i] = this.payloadView.getUint8(i)
        }
        return a
    }

    toString(): string {
        return `Packet{`+
            `peerId=${this.peerId},`+
            `seqNr=${this.seqNr},`+
            `channel=${this.channel},`+
            `type=${PacketType[this.packetType]},`+
            `control=${ControlType[this.controlType]},`+
            `subType=${PacketType[this.subtype]}`+
        `}`
    }
}
