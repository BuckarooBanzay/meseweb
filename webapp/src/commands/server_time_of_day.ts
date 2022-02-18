import { Payload } from "../packet/payload";
import { ServerCommand } from "./command";

export class ServerTimeOfDay implements ServerCommand {
    timeOfday = 0

    UnmarshalPacket(p: Payload): void {
        this.timeOfday = p.getUint16(0)
    }

}