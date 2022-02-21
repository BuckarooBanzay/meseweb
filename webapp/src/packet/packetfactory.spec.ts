import 'jest'
import { ClientInit } from '../commands/client_init'
import { marshal } from "./marshal"
import { createOriginal, createPing } from "./packetfactory"

describe("packet test", function(){
    it("creates a ping packet", function(){
        const p = createPing()
        const payload = marshal(p)
        expect(payload.length).toBe(11)
    })

    it("creates an init command", function(){
        const name = "test"
        const packets = createOriginal(new ClientInit(name), 0)
        expect(packets.length).toBe(1)

        const pkg = packets[0]
        const payload = marshal(pkg)
        const expected_size = 8 + 2 + 7 + 2 + name.length
        expect(payload.length).toBe(expected_size)
    })
})