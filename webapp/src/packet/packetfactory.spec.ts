import 'jest'
import { ClientInit } from '../commands/client_init'
import { marshal } from "./marshal"
import { createOriginal, createPing } from "./packetfactory"

describe("packet test", function(){
    it("creates a ping packet", function(){
        const p = createPing()
        const payload = marshal(p)
        expect(payload.data.length).toBe(11)
    })

    it("creates an init command", function(){
        const name = "test"
        const pkg = createOriginal(new ClientInit(name))
        const payload = marshal(pkg)
        const expected_size = 8 + 2 + 7 + 2 + name.length
        expect(payload.data.length).toBe(expected_size)
    })
})