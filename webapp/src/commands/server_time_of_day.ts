import { ServerCommand } from "./command";

export class ServerTimeOfDay implements ServerCommand {
    timeOfday = 0

    UnmarshalPacket(dv: DataView): void {
        this.timeOfday = dv.getUint16(0)
    }

}