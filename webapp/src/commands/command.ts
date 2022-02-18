import { Payload } from "../packet/payload";


// client -> server
export interface ClientCommand {
    GetCommandID(): number
    MarshalPacket(): Payload
}

// server -> client
export interface ServerCommand {
    UnmarshalPacket(payload: Payload): void
}
