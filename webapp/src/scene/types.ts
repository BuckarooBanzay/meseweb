import { Material } from "three";
import { BlockData } from "../block/blockdata";
import { Pos, PosType } from "../util/pos";

export interface BlockDataProvider {
    getBlockdata(pos: Pos<PosType.Mapblock>): BlockData | undefined
}

export interface MaterialProvider {
    getMaterial(texturedef: string): Promise<Material>
}

