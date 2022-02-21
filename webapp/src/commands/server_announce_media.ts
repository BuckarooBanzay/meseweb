import { PayloadHelper } from "../packet/payloadhelper";
import { ServerCommand } from "./command";

export class ServerAnnounceMedia implements ServerCommand {
    fileCount = 0
    hashes = new Map<string, number[]>()
    remoteServers = new Array<string>()

    UnmarshalPacket(dv: DataView): void {
        this.fileCount = dv.getUint16(0)
        const ph = new PayloadHelper(dv)

        let offset = 2
        for (let i=0; i<this.fileCount; i++){
            const name = ph.getString(offset)
            const hashstr = ph.getString(offset+2+name.length)
            const hashbin = atob(hashstr)
            const hash = new Array<number>(20)
            for (let i=0; i<hashbin.length; i++){
                hash[i] = hashbin.charCodeAt(i)
            }

            console.log("name", name, "hash", hash)
            this.hashes.set(name, hash)
            offset += 2+2+name.length+hashstr.length
        }

        this.remoteServers = ph.getString(offset).split(",")
    }

}