import 'jest'
import { arrayToHex } from './hex'

describe("hex test", function(){
    it("converts to hex properly", function(){
        const a = [1,2,3]
        const str = arrayToHex(a)
        expect(str).toBe("010203")
    })
})