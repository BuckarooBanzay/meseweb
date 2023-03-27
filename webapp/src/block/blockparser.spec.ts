import { Pos, PosType } from "../util/pos"
import { parseBlock } from "./blockparser"
import { blockdata } from "./testdata"

describe("blockparser", function() {
    test("parse", function() {
        const b = parseBlock(Uint8Array.from(blockdata), new Pos<PosType.Mapblock>(0,0,0))
        expect(b).toBeTruthy()
        expect(b.blockMapping.get(126)).toBeTruthy()
        expect(b.mapNodes.length).toBe(4096)
    })
})