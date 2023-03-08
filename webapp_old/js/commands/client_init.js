import { PayloadBuilder } from "../packet/payloadbuilder.js";

export class ClientInit {
    constructor(playername) {
        this.playername = playername;
        // https://github.com/minetest/minetest/blob/master/src/serialization.h#L66
        this.clientMax = 29;
        // unused: https://github.com/minetest/minetest/blob/master/src/network/serverpackethandler.cpp#L100
        this.supportedCompressionModes = 0;
        // https://github.com/minetest/minetest/blob/master/src/network/networkprotocol.h#L208
        this.minNetProtoVersion = 37;
        this.maxNetProtoVersion = 40;
    }

    GetCommandID() {
        return 0x02;
    }

    MarshalPacket() {
        const p = new PayloadBuilder();
        p.appendUint8(this.clientMax);
        p.appendUint16(this.supportedCompressionModes);
        p.appendUint16(this.minNetProtoVersion);
        p.appendUint16(this.maxNetProtoVersion);
        p.appendString(this.playername);
        return p.toUint8Array();
    }

}