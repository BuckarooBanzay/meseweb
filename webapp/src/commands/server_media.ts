import { PayloadHelper } from "../packet/payloadhelper";
import { ServerCommand } from "./command";

export class ServerMedia implements ServerCommand {
    bunches = 0
    index = 0
    numFiles = 0
    files: { [key: string]: Uint8Array } = {}

    UnmarshalPacket(dv: DataView): void {
        const ph = new PayloadHelper(dv)
        this.bunches = dv.getUint16(0)
        this.index = dv.getUint16(2)
        this.numFiles = dv.getUint32(4)

        let offset = 8
        for (let i=0; i<this.numFiles; i++){
            const name = ph.getString(offset)
            offset += 2+name.length

            const data = ph.getUint8Array(offset)
            offset += ph.getUint8ArraySize(data)

            this.files[name] = data
        }
    }
}