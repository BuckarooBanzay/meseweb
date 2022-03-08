import { SplitPacketHandler } from './splitpackethandler.js';
import { Packet } from './types.js';

QUnit.module("splitpackethandler");

QUnit.test("reassembles the data properly", assert => {
    const sph = new SplitPacketHandler();
    const payload = new Uint8Array(400);
    for (let i=0; i<payload.byteLength; i++){
        payload[i] = i % 256;
    }

    const p1 = new Packet();
    p1.payload = new Uint8Array(payload.length + 6);
    p1.payloadView = new DataView(p1.payload.buffer);
    p1.payload.set(payload, 6);
    
    p1.payloadView.setUint16(0, 100); // seqNr
    p1.payloadView.setUint16(2, 2); // chunk count
    p1.payloadView.setUint16(4, 0); // chunk number

    let result = sph.AddSplitPacket(p1);
    assert.equal(result, null);

    const p2 = new Packet();
    p2.payload = new Uint8Array(payload.length + 6);
    p2.payloadView = new DataView(p2.payload.buffer);
    p2.payload.set(payload, 6);
    
    p2.payloadView.setUint16(0, 100); // seqNr
    p2.payloadView.setUint16(2, 2); // chunk count
    p2.payloadView.setUint16(4, 1); // chunk number

    result = sph.AddSplitPacket(p2);
    assert.notEqual(result, null, "no data");
    assert.equal(result.length, 800);

    for (let i=0; i<payload.length; i++){
        assert.equal(result[i], i % 256);
        assert.equal(result[i+payload.length], i % 256);
    }
})