import 'jest'
import { PayloadBuilder } from './payloadbuilder'

describe("payloadbuilder test", function(){
    it("creates uint8 payload properly", function(){
        const p = new PayloadBuilder()
        p.appendUint8(55)
        expect(p.data.length).toBe(1)
        expect(p.data[0]).toBe(55)
    })

    it("creates uint16 payload properly", function(){
        let p = new PayloadBuilder()
        p.appendUint16(10)
        expect(p.data.length).toBe(2)
        expect(p.data[0]).toBe(0)
        expect(p.data[1]).toBe(10)

        p = new PayloadBuilder()
        p.appendUint16(1025)
        expect(p.data.length).toBe(2)
        expect(p.data[0]).toBe(4)
        expect(p.data[1]).toBe(1)
    })

    it("creates string payload properly", function(){
        let p = new PayloadBuilder()
        const name = "test"
        p.appendString(name)
        expect(p.data.length).toBe(6)
        expect(p.data[0]).toBe(0)
        expect(p.data[1]).toBe(4)
        expect(p.data[2]).toBe(name.charCodeAt(0))
        expect(p.data[3]).toBe(name.charCodeAt(1))
        expect(p.data[4]).toBe(name.charCodeAt(2))
        expect(p.data[5]).toBe(name.charCodeAt(3))
    })

})