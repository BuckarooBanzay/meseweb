import { ServerAccessDenied } from "./server/ServerAccessDenied"
import { ServerAnnounceMedia } from "./server/ServerAnnounceMedia"
import { ServerAuthAccept } from "./server/ServerAuthAccept"
import { ServerBlockData } from "./server/ServerBlockData"
import { ServerHello } from "./server/ServerHello"
import { ServerMedia } from "./server/ServerMedia"
import { ServerMovePlayer } from "./server/ServerMovePlayer"
import { ServerNodeDefinitions } from "./server/ServerNodeDefinitions"
import { ServerSRPBytesSB } from "./server/ServerSRPBytesSB"

export interface ServerCommand {
    unmarshalPacket(dv: DataView): void
}

export function getServerCommand(commandId: number): ServerCommand | null {
    switch (commandId) {
        case 0x02: return new ServerHello
        case 0x60: return new ServerSRPBytesSB
        case 0x03: return new ServerAuthAccept
        case 0x0A: return new ServerAccessDenied
        case 0x3A: return new ServerNodeDefinitions
        case 0x3C: return new ServerAnnounceMedia
        case 0x38: return new ServerMedia
        case 0x20: return new ServerBlockData
        case 0x34: return new ServerMovePlayer
    }
    return null
}