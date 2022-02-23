import 'jest'

import { Blockdata, getNodePos } from './blockdata'
const testdata: Array<number> = require('./testdata/block1.json')

describe("blockdata", function(){
    it("returns proper indexes from getNodePos", function(){
        expect(getNodePos(0,0,0)).toBe(0)
        expect(getNodePos(0,1,0)).toBe(16)
        expect(getNodePos(0,0,1)).toBe(16*16)
        expect(getNodePos(1,1,1)).toBe(1+16+(16*16))
    })

    it("parses the blockdata properly", function(){
        const block = new Blockdata()
        const buf = Uint8Array.from(testdata)
        block.parseV28(buf)

        expect(block.mapNodes.length).toBe(4096*4)
        expect(block.GetNodeID(0,0,0)).toBe(0)
    })
})