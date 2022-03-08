import { marshal } from "./marshal.js";
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
