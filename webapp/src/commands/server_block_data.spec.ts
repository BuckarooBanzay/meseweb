import 'jest'
import { ServerBlockData } from './server_block_data'
const testdata = require('./testdata/server_blockdata.json')


describe("server nodedefs command", function(){
    it("unmarshals the data properly", function(){
        const cmd = new ServerBlockData()
        const buf = Uint8Array.from(testdata)
        const dv = new DataView(buf.buffer)
        cmd.UnmarshalPacket(dv)

        expect(cmd.blockPos.X).toBe(-2)
        expect(cmd.blockPos.Y).toBe(2)
        expect(cmd.blockPos.Z).toBe(10)

        console.log(JSON.stringify(cmd))
    })
})