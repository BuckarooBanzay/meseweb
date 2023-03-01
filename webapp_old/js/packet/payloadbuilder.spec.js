import { PayloadBuilder } from './payloadbuilder.js';

QUnit.module("payloadbuilder");
QUnit.test("creates uint8 payload properly", assert => {
    const p = new PayloadBuilder();
    p.appendUint8(55);
    assert.equal(p.data.length, 1);
    assert.equal(p.data[0], 55);
});

QUnit.test("creates uint16 payload properly", assert => {
    let p = new PayloadBuilder();
    p.appendUint16(10);
    assert.equal(p.data.length, 2);
    assert.equal(p.data[0], 0);
    assert.equal(p.data[1], 10);

    p = new PayloadBuilder();
    p.appendUint16(1025);
    assert.equal(p.data.length, 2);
    assert.equal(p.data[0], 4);
    assert.equal(p.data[1], 1);
});

QUnit.test("creates string payload properly", assert => {
    const p = new PayloadBuilder();
    const name = "test";
    p.appendString(name);
    assert.equal(p.data.length, 6);
    assert.equal(p.data[0], 0);
    assert.equal(p.data[1], 4);
    assert.equal(p.data[2], name.charCodeAt(0));
    assert.equal(p.data[3], name.charCodeAt(1));
    assert.equal(p.data[4], name.charCodeAt(2));
    assert.equal(p.data[5], name.charCodeAt(3));
});
