import { ServerCommand } from "./command";

export class ServerChatMessage implements ServerCommand {
    message = ""

    UnmarshalPacket(dv: DataView): void {
        const len = dv.getUint8(5)
        for (let i=0; i<len; i+=2){
            const c = dv.getUint16(6+(i*2))
            this.message += String.fromCharCode(c)
        }
    }
}