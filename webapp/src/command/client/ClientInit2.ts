import { ClientCommand } from "../ClientCommand";

export class ClientInit2 implements ClientCommand {
    getCommandID(): number {
        return 0x11
    }
    marshalPacket(): Uint8Array {
        return new Uint8Array(2)
    }

}