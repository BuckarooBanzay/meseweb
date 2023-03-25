import { Client } from "../Client";
import { MaterialProvider } from "./MaterialProvider";
import { WorldMap } from "./WorldMap";

export class Scene {
    constructor(public client: Client, public wm: WorldMap, e: HTMLElement) {}

    materialprovider = new MaterialProvider(this.client)
}