import { PayloadHelper } from "../packet/PayloadHelper"
import { ServerCommand } from "../ServerCommand"

export class ServerChatMessage implements ServerCommand {
    message = ""

    unmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv)
        this.message = ph.getWideString(4)
    }

}