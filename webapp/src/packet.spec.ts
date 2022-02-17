import 'jest'
import { createPing, marshal } from "./packet"

describe("packet test", function(){
    it("CreatePing", function(){
        const p = createPing()
        const data = marshal(p)
        expect(data.length).toBe(11)
    })
})