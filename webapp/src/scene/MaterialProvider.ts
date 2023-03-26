import { DoubleSide, FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three"
import { Client } from "../Client"

function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result as string)
    })
}

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
            return blob
        })
        .then(blob => blobToDataURL(blob))
        .then(url => {
            const loader = new TextureLoader()
            const texture = loader.load(url)
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