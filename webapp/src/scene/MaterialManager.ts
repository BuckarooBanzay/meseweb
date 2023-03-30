import { FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three";
import { MediaManager } from "../media/MediaManager";
import { NodeDefinition } from "../nodedefs/NodeDefinition";
import { Directions, Pos, PosType } from "../util/pos";


function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result as string)
    })
}

export class MaterialManager {
    constructor(private nodedefs: Map<number, NodeDefinition>, private mm: MediaManager) {}

    materialCache = new Map<string, Material>()

    getKey(nodeid: number, direction: Pos<PosType.Node>): string {
        return `${nodeid}/${direction}`
    }

    getTileIndex(direction: Pos<PosType.Node>): number {
        switch (direction) {
            case Directions.Y_POS:
                return 0
            case Directions.Y_NEG:
                return 1
            case Directions.X_POS:
                return 2
            case Directions.X_NEG:
                return 3
            case Directions.Z_POS:
                return 4
            case Directions.Z_NEG:
                return 5
        }
        // default
        return 0
    }

    getMaterial(nodeid: number, direction: Pos<PosType.Node>): Promise<Material|null> {
        const key = this.getKey(nodeid, direction)
        if (this.materialCache.has(key)) {
            // cached
            return Promise.resolve(this.materialCache.get(key)!)
        }

        // generate
        const nodedef = this.nodedefs.get(nodeid)!
        if (nodedef == undefined) {
            return Promise.reject(`Nodedef not found: ${nodeid}`)
        }

        const tileindex = this.getTileIndex(direction)
        const tiledef = nodedef.tileDefs[tileindex]
        let textureName = tiledef.name;
        //console.log(`Trying to resolve texture from '${nodedef.name}' textureName=${textureName}`);
        if (textureName.includes("^")) {
            textureName = textureName.split("^")[0];
        }

        return new Promise((resolve, reject)=> {
            return this.mm.getMedia(textureName)
            .then(blob => {
                if (blob == null) {
                    reject()
                }
                return blobToDataURL(blob!)
            })
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
    
                this.materialCache.set(key, material)
                resolve(material)
            })
        })
    }
}