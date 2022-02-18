import { ServerCommand } from "./command";

export class ServerAccessDenied implements ServerCommand {
    UnmarshalPacket(dv: DataView): void {}
}