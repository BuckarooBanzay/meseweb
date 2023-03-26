import Logger from "js-logger"
import { FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three"
import { Client } from "../Client"

export class MaterialProvider {
    constructor(public client: Client) {}

    materials = new Map<string, Material>

    getMaterial(texturedef: string): Promise<Material> {
        if (this.materials.has(texturedef)) {
            // already generated
            return Promise.resolve(this.materials.get(texturedef)!)
        }

        return this.client.mediamanager.getMedia(texturedef)
        .then(blob => {
            if (blob == null) {
                // return unknown node texture
                return this.client.mediamanager.getMedia("unknown_node.png")
            } else {
                return blob
            }
        })
        .then(blob => {
            if (blob == null) {
                throw new Error(`texture not found: ${texturedef}`)
            }
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