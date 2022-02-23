import 'jest'

import { Blockdata } from './blockdata'
const testdata: Array<number> = require('./testdata/block1.json')

describe("blockdata", function(){
    it("parses the blockdata properly", function(){
        const block = new Blockdata()
        const buf = Uint8Array.from(testdata)
        block.parseV28(buf)

        expect(block.mapNodes.length).toBe(4096*4)
        expect(block.GetNodeID(0,0,0)).toBe(0)
    })
})