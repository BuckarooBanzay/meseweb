
export interface ClientCommand {
    GetCommandID(): number
    MarshalPacket(): Uint8Array
}