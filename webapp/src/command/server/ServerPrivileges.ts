import { PayloadHelper } from "../packet/PayloadHelper"
import { ServerCommand } from "../ServerCommand"

export class ServerPrivileges implements ServerCommand {

    privileges = new Array<string>()

    unmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv)
        this.privileges = ph.getStringArray(0)
    }
}