import { ClientCommand } from "../ClientCommand";

export class ClientGotBlocks implements ClientCommand {
    getCommandID(): number {
        return 0x24
    }
    marshalPacket(): Uint8Array {
        throw new Error("Method not implemented.");
    }

}