import { ServerHello } from "./server/ServerHello"

export interface ServerCommand {
    UnmarshalPacket(dv: DataView): void
}

export function getServerCommand(commandId: number): ServerCommand | null {
    switch (commandId) {
        case 0x02: return new ServerHello
    }
    return null
}