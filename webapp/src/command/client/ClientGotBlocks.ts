import { ClientCommand } from "../ClientCommand";

export class ClientGotBlocks implements ClientCommand {
    GetCommandID(): number {
        return 0x24
    }
    MarshalPacket(): Uint8Array {
        throw new Error("Method not implemented.");
    }

}