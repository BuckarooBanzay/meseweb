import { Packet, ControlType, PacketType, MaxPacketLength } from "./types.js";
import { splitPayload } from "./splitter.js";

export function createPing() {
    const p = new Packet();
    p.packetType = PacketType.Control;
    p.controlType = ControlType.Ping;
    return p;
}

export function createDisconnect() {
    const p = new Packet();
    p.packetType = PacketType.Control;
    p.controlType = ControlType.Disco;
    return p;
}

export function createAck(srcp, peerId) {
    const p = new Packet();
    p.packetType = PacketType.Control;
    p.controlType = ControlType.Ack;
    p.seqNr = srcp.seqNr;
    p.peerId = peerId;
    return p;
}

export function createPeerInit() {
    const p = new Packet();
    p.packetType = PacketType.Reliable;
    p.subtype = PacketType.Original;
    p.channel = 0;
    p.payload = new Uint8Array(2);
    return p;
}

export function createCommandPacket(cmd, peerId, type) {
    const commandPayload = cmd.MarshalPacket();
    const payload = new Uint8Array(2 + commandPayload.length);
    const dv = new DataView(payload.buffer);
    dv.setUint16(0, cmd.GetCommandID());
    payload.set(commandPayload, 2);

    if (payload.length > MaxPacketLength) {
        // split into multiple packets
        const packets = splitPayload(payload);
        packets.forEach(p => {
            p.packetType = PacketType.Reliable;
            p.subtype = PacketType.Split;
            p.peerId = peerId;
            p.channel = 1;
        });

        return packets;
    }

    // just a single packet
    const p = new Packet();
    p.packetType = type;
    p.subtype = PacketType.Original;
    p.payload = payload;
    p.channel = 1;
    p.peerId = peerId;
    return [p];
}