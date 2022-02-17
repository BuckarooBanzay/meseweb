import 'jest'
import { marshal } from "./marshal"
import { createPing } from "./packetfactory"

describe("packet test", function(){
    it("CreatePing", function(){
        const p = createPing()
        const data = marshal(p)
        expect(data.length).toBe(11)
    })
})