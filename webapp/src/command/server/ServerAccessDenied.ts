import { ServerCommand } from "../ServerCommand";

export class ServerAccessDenied implements ServerCommand {
    unmarshalPacket(dv: DataView): void {}
}