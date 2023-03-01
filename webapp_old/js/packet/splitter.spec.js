import { MaxPacketLength } from './types.js';
import { splitArray } from './splitter.js';

QUnit.module("splitter");
QUnit.test("splits buffers", assert => {
    const buf = new Uint8Array(800);
    const parts = splitArray(buf, MaxPacketLength);

    assert.equal(parts.length, 2);
    assert.equal(parts[0].byteLength, MaxPacketLength);
    assert.equal(parts[1].byteLength, buf.length - MaxPacketLength);
});

QUnit.test("doesn't split small buffers", assert => {
    const buf = new Uint8Array(400);
    const parts = splitArray(buf, MaxPacketLength);

    assert.equal(parts.length, 1);
    assert.equal(parts[0].byteLength, buf.length);
});
