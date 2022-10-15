
const dirKeyTileIndexMap = {
    "+y": 0,
    "-y": 1,
    "+x": 2,
    "-x": 3,
    "+z": 4,
    "-z": 5
};

export class TextureManager {
    constructor(mediaManager, nodedefs){
        this.mediaManager = mediaManager;
        this.nodedefs = nodedefs;
        this.cache = {};
    }

    getCacheKey(nodeid, dirKey) {
        return `${nodeid}/${dirKey}`;
    }

    getMaterial(nodeid, dirKey) {
        const cachekey = this.getCacheKey(nodeid, dirKey);
        const cacheMaterial = this.cache[cachekey];
        if (cacheMaterial != undefined){
            return Promise.resolve(cacheMaterial);
        }

        const nodedef = this.nodedefs.nodeMapping[nodeid];
        if (!nodedef){
            return Promise.resolve();
        }
        const tileIndex = dirKeyTileIndexMap[dirKey];
        const tileDef = nodedef.tileDefs[tileIndex];
        let textureName = tileDef.name;
        //console.log(`Trying to resolve texture from '${nodedef.name}' textureName=${textureName}`);
        if (textureName.includes("^")) {
            textureName = textureName.split("^")[0];
        }

        return this.mediaManager.getMedia(textureName).then(blob => {
            if (!blob){
                return;
            }
            const url = URL.createObjectURL(blob);

            const loader = new THREE.TextureLoader();
            const texture = loader.load(url, () => {
                URL.revokeObjectURL(url);
            });
            texture.magFilter = THREE.NearestFilter;

            const material = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                map: texture,
                side: THREE.FrontSide,
                //transparent: true
            });

            //console.log(`Created new material from nodeid=${nodeid} texture=${textureName}`);

            this.cache[cachekey] = material;

            return material;
        });
    }

}