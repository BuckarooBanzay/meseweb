import { unmarshal } from "../packet/marshal";
import { ClientCommand } from "./ClientCommand";

export class CommandClient {
    constructor(public ws: WebSocket) {
        ws.addEventListener("open", () => this.onOpen())
        ws.addEventListener("message", ev => this.onMessage(ev))
    }

    private onOpen() {
        console.log("websocket opened")
    }

    private onMessage(ev: MessageEvent<Blob>) {
        ev.data.arrayBuffer().then(function(ab){
            const buf = new Uint8Array(ab);
            const p = unmarshal(buf);
            console.log(p)
            //TODO
        })
    }

    SendCommand(cmd: ClientCommand) {
        //TODO
    }
}