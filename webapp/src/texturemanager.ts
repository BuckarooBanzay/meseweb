import { ServerNodeDefinitions } from "./commands/server_node_definitions";
import { MediaManager } from "./media/mediamanager";
import { Material, TextureLoader, MeshBasicMaterial, NearestFilter, DoubleSide } from 'three'


export class TextureManager {
    constructor(public mediaManager: MediaManager, public nodedefs: ServerNodeDefinitions){}

    cache = new Map<string, Material>()

    getCacheKey(nodeid: number): string {
        return "" + nodeid
    }

    async getMaterial(nodeid: number): Promise<Material|undefined> {
        const cachekey = this.getCacheKey(nodeid)
        const cacheMaterial = this.cache.get(cachekey)
        if (cacheMaterial != undefined){
            return cacheMaterial
        }

        const nodedef = this.nodedefs.nodeMapping[nodeid]
        let textureName = nodedef.tileDefs[0].name
        if (textureName.includes("^")) {
            textureName = textureName.split("^")[0]
        }

        const blob = await this.mediaManager.getMedia(textureName)
        if (!blob){
            return
        }
        const url = URL.createObjectURL(blob)

        const loader = new TextureLoader()
        const texture = loader.load(url, () => {
            URL.revokeObjectURL(url)
        })
        texture.magFilter = NearestFilter

        const material = new MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            side: DoubleSide
        })

        this.cache.set(cachekey, material)

        return material
    }

}