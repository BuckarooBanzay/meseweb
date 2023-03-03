import { ServerAccessDenied } from "./server/ServerAccessDenied"
import { ServerAuthAccept } from "./server/ServerAuthAccept"
import { ServerHello } from "./server/ServerHello"
import { ServerSRPBytesSB } from "./server/ServerSRPBytesSB"

export interface ServerCommand {
    UnmarshalPacket(dv: DataView): void
}

export function getServerCommand(commandId: number): ServerCommand | null {
    switch (commandId) {
        case 0x02: return new ServerHello
        case 0x60: return new ServerSRPBytesSB
        case 0x03: return new ServerAuthAccept;
        case 0x0A: return new ServerAccessDenied;
    }
    return null
}