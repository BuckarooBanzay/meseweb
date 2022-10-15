import { marshal, unmarshal } from "./marshal.js";
import { createAck } from "./packetfactory.js";
import { Packet, PacketType } from './types.js';

QUnit.module("marshal");
QUnit.test("creates a proper ack", assert => {
    const srcp = new Packet();
    srcp.channel = 0;
    srcp.peerId = 1;
    srcp.packetType = PacketType.Reliable;
    srcp.subtype = PacketType.Split;
    srcp.seqNr = 65504;
    
    const ack = createAck(srcp, 55);
    const buf = marshal(ack);

    const ab = new ArrayBuffer(buf.byteLength);
    const dv = new DataView(ab);
    for (let i=0; i<buf.byteLength; i++){
        dv.setUint8(i, buf[i]);
    }

    assert.equal(buf.byteLength, 11, "buffer length");
    assert.equal(dv.getUint16(4), 55);
    assert.equal(dv.getUint16(9), srcp.seqNr);
});

QUnit.test("properly unmarshals a packet", assert => {
    // TOCLIENT_SET_LIGHTING
    const data = [
        0x4f,0x45,0x74,0x3, //protocol id
        0x0,0x1,  // peerID
        0x0, // channel
        0x1, // packet type
        0x0,0x63, // command id
        0x3e,0xf0,0x49,0xb1
    ];
    const buf = new Uint8Array(data);
    const pkg = unmarshal(buf);
    assert.equal(pkg.payload.length, 6);
})