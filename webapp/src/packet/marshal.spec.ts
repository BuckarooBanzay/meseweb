import 'jest'
import { marshal } from "./marshal"
import { createAck } from "./packetfactory"
import { Packet, PacketType } from './types'

describe("packet test", function(){
    it("creates a proper ack", function(){
        const srcp = new Packet()
        srcp.channel = 0
        srcp.peerId = 1
        srcp.packetType = PacketType.Reliable
        srcp.subtype = PacketType.Split
        srcp.seqNr = 65504
        
        const ack = createAck(srcp, 55)
        const buf = marshal(ack)

        const ab = new ArrayBuffer(buf.byteLength)
        const dv = new DataView(ab)
        for (let i=0; i<buf.byteLength; i++){
            dv.setUint8(i, buf[i])
        }

        expect(buf.byteLength).toBe(11)
        expect(dv.getUint16(4)).toBe(55)
        expect(dv.getUint16(9)).toBe(srcp.seqNr)
    })
})