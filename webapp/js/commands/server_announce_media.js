import { PayloadHelper } from "../packet/payloadhelper.js";
import { stringToHex } from "../util/hex.js";

export class ServerAnnounceMedia {
    constructor(){
        // filename -> hash as string[40]
        this.hashes = {};
    }

    UnmarshalPacket(dv) {
        this.fileCount = dv.getUint16(0);
        const ph = new PayloadHelper(dv);

        let offset = 2;
        for (let i=0; i<this.fileCount; i++){
            const name = ph.getString(offset);
            const hashstr = ph.getString(offset+2+name.length);
            const hashbin = atob(hashstr);
            const hashHex = stringToHex(hashbin);
            this.hashes[name] = hashHex;
            offset += 2+2+name.length+hashstr.length;
        }

        this.remoteServers = ph.getString(offset).split(",");
    }

}