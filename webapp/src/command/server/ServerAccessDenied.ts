import { ServerCommand } from "../ServerCommand";

export class ServerAccessDenied implements ServerCommand {
    UnmarshalPacket(dv: DataView): void {}
}