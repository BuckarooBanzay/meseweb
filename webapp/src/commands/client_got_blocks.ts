import { PayloadBuilder } from "../packet/payloadbuilder";
import { Pos } from "../types/pos";
import { ClientCommand } from "./command";

export class ClientGotBlocks implements ClientCommand {
    blocks = new Array<Pos>()

    GetCommandID(): number {
        return 0x24
    }
    MarshalPacket(): Uint8Array {
        const pb = new PayloadBuilder()
        pb.appendUint8(this.blocks.length)

        for (let i=0; i<this.blocks.length; i++){
            pb.appendUint16(this.blocks[i].X)
            pb.appendUint16(this.blocks[i].Y)
            pb.appendUint16(this.blocks[i].Z)
        }

        return pb.toUint8Array()
    }

}