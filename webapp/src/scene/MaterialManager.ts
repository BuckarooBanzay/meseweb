import { FrontSide, Material, MeshLambertMaterial, NearestFilter, TextureLoader } from "three";
import { MediaManager } from "../media/MediaManager";
import { NodeDefinition } from "../nodedefs/NodeDefinition";
import { CardinalNodeDirections, Directions, Pos, PosType } from "../util/pos";
import { UnknownNodePNG } from "./builtin";


function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result as string)
    })
}

export class MaterialManager {
    constructor(private nodedefs: Map<number, NodeDefinition>, private mm: MediaManager) {}

    generate(): Promise<void[]> {
        const promises = new Array<Promise<void>>()
        this.nodedefs.forEach(nd => {
            CardinalNodeDirections.forEach(dir => {
                promises.push(this.generateMaterial(nd, dir))
            })
        })

        return Promise.all(promises)
    }

    generateMaterial(nodedef: NodeDefinition, dir: Pos<PosType.Node>): Promise<void> {
        const key = this.getKey(nodedef.id, dir)
        const tileindex = this.getTileIndex(dir)
        const tiledef = nodedef.tileDefs[tileindex]

        let textureName = tiledef.name;
        if (textureName.includes("^")) {
            textureName = textureName.split("^")[0]
        }

        if (textureName == "") {
            // fall back to unknown node
            textureName = "unknown_node.png"
        }

        return new Promise((resolve, reject) => {
            return this.mm.getMedia(textureName)
            .then(blob => blob ? blob : new Blob([Uint8Array.from(UnknownNodePNG)], {type: "octet/stream"}))
            .then(blob => blobToDataURL(blob!))
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
                resolve()
            })
            .catch(e => reject(new Error(`Couldn't generate material for '${textureName}', dir: ${dir}, error: ${e}`)))
        })
    }

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

    getMaterial(nodeid: number, direction: Pos<PosType.Node>): Material|undefined {
        const key = this.getKey(nodeid, direction)
        return this.materialCache.get(key)
    }
}