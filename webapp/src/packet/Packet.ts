import { ControlType, PacketType } from "./types";

export class Packet {

    packetType = PacketType.Control
    controlType = ControlType.Ack
    subType = PacketType.Control
    peerId!: number
    seqNr = -1
    channel!: number
    payload = new Uint8Array()
    payloadView = new DataView(this.payload.buffer)

    dumpPayload() {
        const a = new Array(this.payloadView.byteLength);
        for (let i=0; i<this.payloadView.byteLength; i++){
            a[i] = this.payloadView.getUint8(i);
        }
        return a;
    }

    toString() {
        return `Packet{`+
            `peerId=${this.peerId},`+
            `seqNr=${this.seqNr},`+
            `channel=${this.channel},`+
            `type=${PacketType[this.packetType]},`+
            `control=${ControlType[this.controlType]},`+
            `subType=${PacketType[this.subType]},`+
            `payload=${this.payload}` +
        `}`;
    }
}
