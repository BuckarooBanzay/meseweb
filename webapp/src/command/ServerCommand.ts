export interface ServerCommand {
    UnmarshalPacket(dv: DataView): void
}