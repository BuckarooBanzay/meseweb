import { dataViewToHexDump } from "../../util/hex"
import { Pos, PosType } from "../../util/pos"
import { ClientPlayerPos } from "./ClientPlayerPos"

describe("ClientPlayerPos", function() {
    test("marshal", function() {
        const pp = new ClientPlayerPos(new Pos<PosType.Entity>(10,20,30))
        const a = pp.marshalPacket()

        console.log(dataViewToHexDump(new DataView(a.buffer)))
    })
})