import 'jest'
import { CreatePing } from "./packet"

describe("packet test", function(){
    it("CreatePing", function(){
        const p = CreatePing()
        const data = p.Marshal()
        expect(data.length).toBe(11)
    })
})