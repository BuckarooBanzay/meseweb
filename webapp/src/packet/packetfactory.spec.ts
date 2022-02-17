import 'jest'
import { marshal } from "./marshal"
import { createPing } from "./packetfactory"

describe("packet test", function(){
    it("CreatePing", function(){
        const p = createPing()
        const payload = marshal(p)
        expect(payload.data.length).toBe(11)
    })
})