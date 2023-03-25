import { FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three";
import { BlockData } from "../block/blockdata";
import { parseBlock } from "../block/blockparser";
import { Client } from "../Client";
import { ServerBlockData } from "../command/server/ServerBlockData";
import { Pos, PosType } from "../util/pos";
import { MaterialProvider } from "./MaterialProvider";

export class Scene {
    constructor(public client: Client, e: HTMLElement) {}

    materialprovider = new MaterialProvider(this.client)
}