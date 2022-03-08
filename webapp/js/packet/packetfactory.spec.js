import { ClientInit } from '../commands/client_init.js';
import { marshal } from "./marshal.js";
import { createCommandPacket, createPing } from "./packetfactory.js";
import { PacketType } from './types.js';

QUnit.module("packetfactory");
QUnit.test("creates a ping packet", assert => {
    const p = createPing();
    const payload = marshal(p);
    assert.equal(payload.length, 11, "payload length");
});

QUnit.test("creates an init command", assert => {
    const name = "test"
    const packets = createCommandPacket(new ClientInit(name), 0, PacketType.Original);
    assert.equal(packets.length, 1, "packet count");

    const pkg = packets[0];
    const payload = marshal(pkg);
    const expected_size = 8 + 2 + 7 + 2 + name.length;
    assert.equal(payload.length, expected_size, "payload length");
});
