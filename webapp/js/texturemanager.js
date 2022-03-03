
export class TextureManager {
    constructor(mediaManager, nodedefs){
        this.mediaManager = mediaManager;
        this.nodedefs = nodedefs;
        this.cache = {};
    }

    getCacheKey(nodeid) {
        return "" + nodeid;
    }

    async getMaterial(nodeid) {
        const cachekey = this.getCacheKey(nodeid);
        const cacheMaterial = this.cache[cachekey];
        if (cacheMaterial != undefined){
            return cacheMaterial;
        }

        const nodedef = this.nodedefs.nodeMapping[nodeid];
        let textureName = nodedef.tileDefs[0].name;
        console.log(`Trying to resolve texture from '${nodedef.name}' textureName=${textureName}`);
        if (textureName.includes("^")) {
            textureName = textureName.split("^")[0];
        }

        const blob = await this.mediaManager.getMedia(textureName);
        if (!blob){
            return;
        }
        const url = URL.createObjectURL(blob);

        const loader = new THREE.TextureLoader();
        const texture = loader.load(url, () => {
            URL.revokeObjectURL(url);
        });
        texture.magFilter = THREE.NearestFilter;

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture,
            side: THREE.DoubleSide
        });

        console.log(`Created new material from nodeid=${nodeid} texture=${textureName}`);

        this.cache[cachekey] = material;

        return material;
    }

}