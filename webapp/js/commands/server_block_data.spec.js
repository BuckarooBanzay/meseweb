import { ServerBlockData } from './server_block_data.js';

QUnit.module("server_block_data");
QUnit.test("unmarshals the data properly", assert => {
    const done = assert.async();
    fetch("js/commands/testdata/server_blockdata.json")
    .then(r => r.json())
    .then(testdata => {
        const cmd = new ServerBlockData();
        const buf = Uint8Array.from(testdata);
        const dv = new DataView(buf.buffer);
        cmd.UnmarshalPacket(dv);

        assert.equal(cmd.blockPos.X, -12, "x blockpos");
        assert.equal(cmd.blockPos.Y, -2, "y blockpos");
        assert.equal(cmd.blockPos.Z, -12, "z blockpos");
        assert.ok(cmd.blockData);
        assert.ok(cmd.blockData.mapNodes);
        assert.equal(cmd.blockData.mapNodes.length, 4096*4);
        done();
    });
});