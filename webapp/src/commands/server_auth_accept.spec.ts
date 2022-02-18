import 'jest'
import { Payload } from '../packet/payload'
import { ServerAuthAccept } from './server_auth_accept'

describe("server auth accept", function(){
    it("unmarshalls the command properly", function(){
        const cmdData = [0,3, 0,0,0,0, 0,0,0,0, 0,0,0,0, 131,46,85,56,166,112,47,58, 61,184,81,236,0,0,0,2]
        const p = new Payload(cmdData).subPayload(2)
        const cmd = new ServerAuthAccept()
        cmd.UnmarshalPacket(p)

        expect(cmd.posX).toBe(0)
        expect(cmd.posY).toBe(0)
        expect(cmd.posZ).toBe(0)
        expect(cmd.seed).toBe("9476562641788044163")
    })
})