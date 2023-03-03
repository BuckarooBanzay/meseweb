import { ClientCommand } from "../ClientCommand";

export class ClientInit2 implements ClientCommand {
    GetCommandID(): number {
        return 0x11
    }
    MarshalPacket(): Uint8Array {
        return new Uint8Array(2)
    }

}