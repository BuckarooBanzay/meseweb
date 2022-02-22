import { Blockpos } from "../types/blockpos";
import { ServerCommand } from "./command";

export class ServerBlockData implements ServerCommand {
    blockPos = new Blockpos()

    UnmarshalPacket(dv: DataView): void {
        this.blockPos.X = dv.getInt16(0)
        this.blockPos.Y = dv.getInt16(2)
        this.blockPos.Z = dv.getInt16(4)
    }
}