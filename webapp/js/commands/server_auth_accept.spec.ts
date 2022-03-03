import 'jest'
import { ServerAuthAccept } from './server_auth_accept'

describe("server auth accept", function(){
    it("unmarshalls the command properly", function(){
        const cmdData = [0,0,0,0, 0,0,0,0, 0,0,0,0, 131,46,85,56,166,112,47,58, 61,184,81,236,0,0,0,2]
        const buf = Uint8Array.from(cmdData)
        const dv = new DataView(buf.buffer)
        const cmd = new ServerAuthAccept()
        cmd.UnmarshalPacket(dv)

        expect(cmd.posX).toBe(0)
        expect(cmd.posY).toBe(0)
        expect(cmd.posZ).toBe(0)
        expect(cmd.seed).toBe("9452586369696149306")
    })
})