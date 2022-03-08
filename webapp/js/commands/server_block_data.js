import { Pos } from "../types/pos.js";
import { Blockdata } from "../block/blockdata.js";

export class ServerBlockData {
    constructor(){
        this.blockData = new Blockdata();
    }

    UnmarshalPacket(dv) {
        this.blockPos = new Pos(dv.getInt16(0), dv.getInt16(2), dv.getInt16(4));
        const rawData = new Uint8Array(dv.buffer.slice(dv.byteOffset+6));
        this.blockData.parseV28(rawData);
    }
}