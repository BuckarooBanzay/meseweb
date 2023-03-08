import { parseBlock } from "./blockparser"
import { blockdata } from "./testdata"

describe("blockparser", function() {
    test("parse", function() {
        const b = parseBlock(Uint8Array.from(blockdata))
        expect(b).toBeTruthy()
        expect(b.blockMapping.get(126)).toBeTruthy()
    })
})