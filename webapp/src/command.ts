
export interface Command {
    GetCommandID(): number
    MarshalPacket(): Uint8Array
    UnmarshalPacket(data: Uint8Array): void
}