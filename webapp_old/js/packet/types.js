
export const MaxPacketLength = 495;

export const ProtocolID = [0x4f, 0x45, 0x74, 0x03];

function fromValue(v) {
    const keys = Object.keys(this);
    for (let i=0; i<keys.length; i++){
        const key = keys[i];
        if (v == this[key]){
            return key;
        }
    }
    return "<unknown>";
}


export const PacketType = {
    Control: 0x00,
    Original: 0x01,
    Split: 0x02,
    Reliable: 0x03,
    fromValue: fromValue
};

export const ControlType = {
    Ack: 0x00,
    SetPeerID: 0x01,
    Ping: 0x02,
    Disco: 0x03,
    fromValue: fromValue
};

export class Packet {
    constructor(){
        this.packetType = PacketType.Control;
        this.controlType = ControlType.Ack;
        this.subtype = PacketType.Control;
        this.peerId = 0;
        this.seqNr = -1;
        this.channel = 0;
        this.payload = new Uint8Array(0);
        this.payloadView = new DataView(this.payload.buffer);    
    }

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
            `type=${PacketType.fromValue(this.packetType)},`+
            `control=${ControlType.fromValue(this.controlType)},`+
            `subType=${PacketType.fromValue(this.subtype)}`+
        `}`;
    }
}
