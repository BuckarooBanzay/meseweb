import { ClientCommand } from "./ClientCommand";

export class CommandClient {
    constructor(public ws: WebSocket) {}

    SendCommand(cmd: ClientCommand) {
        //TODO
    }
}