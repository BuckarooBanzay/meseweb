import { ServerCommand } from "../ServerCommand";

export class ServerNodeDefinitions implements ServerCommand {

    data!: ArrayBuffer

    unmarshalPacket(dv: DataView): void {
        this.data = dv.buffer.slice(dv.byteOffset + 4);
    }
}