import { Blockdata, getNodePos } from './blockdata.js';
import { Pos } from '../types/pos.js';

QUnit.module("blockdata");
QUnit.test("returns proper indexes from getNodePos", assert => {
    assert.equal(getNodePos(new Pos(0,0,0)), 0);
    assert.equal(getNodePos(new Pos(0,1,0)), 16);
    assert.equal(getNodePos(new Pos(0,0,1)), 16*16);
    assert.equal(getNodePos(new Pos(1,1,1)), 1+16+(16*16));
});

QUnit.test("parses the blockdata properly", assert => {
    const done = assert.async();
    fetch("js/block/testdata/block1.json")
    .then(r => r.json())
    .then(testdata => {
        const block = new Blockdata();
        const buf = Uint8Array.from(testdata);
        block.parseV28(buf);

        assert.equal(block.mapNodes.length, 4096*4);
        assert.equal(block.GetNodeID(new Pos(0,0,0)), 0);
        done();
    });
});
