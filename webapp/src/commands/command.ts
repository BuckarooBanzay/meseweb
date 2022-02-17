import { Payload } from "../packet/payload";


export interface Command {
    GetCommandID(): number
}

// client -> server
export interface ClientCommand extends Command {
    MarshalPacket(): Payload
}

// server -> client
export interface ServerCommand extends Command {
    UnmarshalPacket(payload: Payload): void
}
