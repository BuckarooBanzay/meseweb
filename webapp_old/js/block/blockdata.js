
/**
 * @param {*} pos the position as object
 * @returns {number} the node position
 */
export function getNodePos(pos) {
    return pos.X + (pos.Y * 16) + (pos.Z * 256);
}

export class Blockdata {
    constructor(){
        this.underground = false;
        this.dayNightDiff = false;
        this.generated = false;
        this.lightingComplete = 0;
        this.contentWidth = 0;
        this.paramsWidth = 0;
        this.mapNodes = null;
        this.mapNodeView = null;
        this.blockMapping = {};
    }

    GetNodeID(pos) {
        const index = getNodePos(pos);
        return this.mapNodeView.getUint16(index*2);
    }

    parseV28(buf) {
        const dv = new DataView(buf.buffer);
        let offset = 0;

        const flags = dv.getUint8(offset++);
        this.underground = (flags & 0x01) == 0x01;
        this.dayNightDiff = (flags & 0x02) == 0x02;
        this.generated = (flags & 0x04) == 0x04; //TODO: invert?
        this.lightingComplete = dv.getUint16(offset);
        offset+=2;
        this.contentWidth = dv.getUint8(offset++);
        this.paramsWidth = dv.getUint8(offset++);

        const ab = dv.buffer.slice(offset);
        const compressedMapnodes = new Uint8Array(ab);

        if (compressedMapnodes[0] != 0x78 || compressedMapnodes[1] != 0x9c) {
            throw new Error("invalid zlib magic");
        }

        const inflate = new Zlib.Inflate(compressedMapnodes);
        this.mapNodes = inflate.decompress();
        this.mapNodeView = new DataView(this.mapNodes.buffer);

        if (this.mapNodes.byteLength != (4096*4)){
            throw new Error("invalid decompressed size");
        }

        for (let i=0; i<4096; i++){
            this.blockMapping[this.mapNodes[i]] = true;
        }

        //TODO: compressed metadata

        //TODO: static objects

        //TODO: block mapping (if even relevant in the network-context)
    }
}
