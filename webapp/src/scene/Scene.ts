import { FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three";
import { BlockData } from "../block/blockdata";
import { parseBlock } from "../block/blockparser";
import { Client } from "../Client";
import { ServerBlockData } from "../command/server/ServerBlockData";
import { Pos, PosType } from "../util/pos";
import { MaterialProvider } from "./types";

export class Scene implements MaterialProvider {
    constructor(public client: Client, e: HTMLElement) {}

    materials = new Map<string, Material>

    getMaterial(texturedef: string): Promise<Material> {
        if (this.materials.has(texturedef)) {
            // already generated
            return Promise.resolve(this.materials.get(texturedef)!)
        }

        return this.client.mediamanager.hasMedia(texturedef)
        .then(exists => {
            if (!exists) {
                return this.client.mediamanager.getMedia("unknown_node.png")
            } else {
                return this.client.mediamanager.getMedia(texturedef)
            }
        })
        .then(blob => {
            const url = URL.createObjectURL(blob)

            const loader = new TextureLoader()
            const texture = loader.load(url, () => {
                URL.revokeObjectURL(url)
            })
            texture.magFilter = NearestFilter

            const material = new MeshLambertMaterial({
                color: 0xffffff,
                map: texture,
                side: FrontSide,
                transparent: true
            })

            this.materials.set(texturedef, material)

            return material
        })

    }
}