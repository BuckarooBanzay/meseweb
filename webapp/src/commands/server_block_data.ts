import { Pos } from "../types/pos";
import { ServerCommand } from "./command";
import { Blockdata } from "../block/blockdata";

export class ServerBlockData implements ServerCommand {
    blockPos = new Pos(0,0,0)
    blockData = new Blockdata()

    UnmarshalPacket(dv: DataView): void {
        /*
        const d = new Array<number>(dv.byteLength)
        for (let i=0; i<dv.byteLength; i++){
            d[i] = dv.getUint8(i)
        }
        localStorage.setItem("server_block_data", JSON.stringify(d))
        */

        this.blockPos.X = dv.getInt16(0)
        this.blockPos.Y = dv.getInt16(2)
        this.blockPos.Z = dv.getInt16(4)

        const rawData = new Uint8Array(dv.buffer.slice(dv.byteOffset+6))
        this.blockData.parseV28(rawData)
    }
}