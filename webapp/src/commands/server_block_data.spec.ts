import 'jest'
import { ServerBlockData } from './server_block_data'
const testdata: Array<number> = require('./testdata/server_blockdata.json')


describe("server nodedefs command", function(){
    it("unmarshals the data properly", function(){
        console.log(testdata.map(d => "0x"+(d<=16?'0':'')+d.toString(16)).join(","))

        const cmd = new ServerBlockData()
        const buf = Uint8Array.from(testdata)
        const dv = new DataView(buf.buffer)
        cmd.UnmarshalPacket(dv)

        expect(cmd.blockPos.X).toBe(-2)
        expect(cmd.blockPos.Y).toBe(2)
        expect(cmd.blockPos.Z).toBe(10)
        expect(cmd.blockData).toBeDefined()
        expect(cmd.blockData.mapNodes).toBeDefined()
        expect(cmd.blockData.mapNodes.length).toBe(4096*4)

        console.log(JSON.stringify(cmd))
    })
})