import { Pos } from "../types/pos.js";
import { Blockdata } from "../block/blockdata.js";

export class ServerBlockData {
    constructor(){
        this.blockData = new Blockdata();
    }

    UnmarshalPacket(dv) {
        this.blockPos = new Pos(dv.getUint16(0), dv.getUint16(0), dv.getUint16(0));
        const rawData = new Uint8Array(dv.buffer.slice(dv.byteOffset+6));
        this.blockData.parseV28(rawData);
    }
}