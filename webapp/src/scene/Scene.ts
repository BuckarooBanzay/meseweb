import { Client } from "../Client";
import { ChunkedViewManager } from "./ChunkedViewManager";
import { MaterialProvider } from "./MaterialProvider";
import { WorldMap } from "./WorldMap";

export class Scene {

    constructor(public client: Client, public wm: WorldMap, e: HTMLElement) {
        wm.events.on("BlockAdded", b => {
            this.cvm.create(b.pos, b.pos)
            .then(cv => {
                //TODO: add meshes to scene
            })
        })
    }

    materialprovider = new MaterialProvider(this.client)
    cvm = new ChunkedViewManager(this.wm, this.materialprovider, this.client.nodedefs)
}