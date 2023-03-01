import { ClientInit } from "../command/client/ClientInit"
import { marshal } from "./marshal"
import { createCommandPacket, createPing } from "./packetfactory"
import { PacketType } from "./types"

describe("packetfactory", function(){
    test("creates a ping packet", function() {
        const p = createPing()
        const payload = marshal(p)
        expect(payload.length).toBe(11)
    })

    test("creates an init command", function() {
        const name = "test"
        const packets = createCommandPacket(new ClientInit(name), 0, PacketType.Original)
        expect(packets.length).toBe(1)

        const pkg = packets[0]
        const payload = marshal(pkg)
        const expected_size = 8 + 2 + 7 + 2 + name.length
        expect(payload.length).toBe(expected_size)
    })
})