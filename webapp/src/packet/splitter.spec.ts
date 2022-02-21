import 'jest'
import { MaxPacketLength } from './types'
import { splitArray } from './splitter'

describe("splitArray", function(){
    it("splits buffers", function(){
        const buf = new Uint8Array(800)
        const parts = splitArray(buf, MaxPacketLength)

        expect(parts.length).toBe(2)
        expect(parts[0].byteLength).toBe(MaxPacketLength)
        expect(parts[1].byteLength).toBe(buf.length - MaxPacketLength)
    })

    it("doesn't split small buffers", function(){
        const buf = new Uint8Array(400)
        const parts = splitArray(buf, MaxPacketLength)

        expect(parts.length).toBe(1)
        expect(parts[0].byteLength).toBe(buf.length)
    })

})