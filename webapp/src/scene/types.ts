import { Material } from "three";
import { BlockData } from "../block/blockdata";
import { Pos } from "../util/pos";

export interface BlockDataProvider {
    getBlockdata(pos: Pos): BlockData | undefined
}

export interface MaterialProvider {
    getMaterial(texturedef: string): Promise<Material>
}

