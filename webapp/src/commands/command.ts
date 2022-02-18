
// client -> server
export interface ClientCommand {
    GetCommandID(): number
    MarshalPacket(): Uint8Array
}

// server -> client
export interface ServerCommand {
    UnmarshalPacket(dv: DataView): void
}
