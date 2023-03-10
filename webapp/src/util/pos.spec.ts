import { NodePos, Pos } from "./pos"

describe("pos", function() {
    test("calc", function() {
        const np = new NodePos(-1, 10, 20)

        const mbp = np.getMapblockPos()
        expect(mbp.x).toBeCloseTo(-1)
        expect(mbp.y).toBeCloseTo(0)
        expect(mbp.z).toBeCloseTo(1)

        const r = mbp.getNodeRegion()
        expect(r[0].x).toBeCloseTo(-16)
        expect(r[0].y).toBeCloseTo(0)
        expect(r[0].z).toBeCloseTo(16)
        expect(r[1].x).toBeCloseTo(-1)
        expect(r[1].y).toBeCloseTo(15)
        expect(r[1].z).toBeCloseTo(31)

    })
})