import { parseBlock } from "./block/blockparser";
import { Client } from "./Client";
import { ServerBlockData } from "./command/server/ServerBlockData";

export class Scene {
    constructor(public client: Client, e: HTMLElement) {

        client.cc.events.addListener("ServerCommand", cmd => {
            if (cmd instanceof ServerBlockData) {
                const block = parseBlock(cmd.data)

                console.log(`Got block: ${cmd.pos}`, block.blockMapping)
            }
        })
    }
}