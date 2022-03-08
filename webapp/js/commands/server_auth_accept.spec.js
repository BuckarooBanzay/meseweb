import { ServerAuthAccept } from './server_auth_accept.js';

QUnit.module("server_auth_accept");
QUnit.test("unmarshalls the command properly", assert => {
    const cmdData = [0,0,0,0, 0,0,0,0, 0,0,0,0, 131,46,85,56,166,112,47,58, 61,184,81,236,0,0,0,2];
    const buf = Uint8Array.from(cmdData);
    const dv = new DataView(buf.buffer);
    const cmd = new ServerAuthAccept();
    cmd.UnmarshalPacket(dv);

    assert.equal(cmd.posX, 0);
    assert.equal(cmd.posY, 0);
    assert.equal(cmd.posZ, 0);
    assert.equal(cmd.seed, "9452586369696149306");
});