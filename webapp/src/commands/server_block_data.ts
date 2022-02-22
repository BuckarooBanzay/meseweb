import { Blockpos } from "../types/blockpos";
import { ServerCommand } from "./command";
import { Blockdata } from "../block/blockdata";

export class ServerBlockData implements ServerCommand {
    blockPos = new Blockpos()
    blockData = new Blockdata()

    UnmarshalPacket(dv: DataView): void {
        this.blockPos.X = dv.getInt16(0)
        this.blockPos.Y = dv.getInt16(2)
        this.blockPos.Z = dv.getInt16(4)

        const rawData = new Uint8Array(dv.buffer.slice(dv.byteOffset+6))
        this.blockData.parse(rawData)
    }
}