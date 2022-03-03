import { Pos } from "./types/pos.js";

const sideGeometry = new THREE.PlaneGeometry(1,1);

export class MapblockView {
    constructor(scene, cmd, textureManager, nodedefs){
        this.scene = scene;
        this.cmd = cmd;
        this.textureManager = textureManager;
        this.nodedefs = nodedefs;
        this.instanceMap = {};
        this.posOffset = new Pos(this.cmd.blockPos.X*16, this.cmd.blockPos.Y*16, this.cmd.blockPos.Z*16);
    }
    
    async render() {
        console.log(`Drawing mapblock ${this.cmd.blockPos.X}/${this.cmd.blockPos.Y}/${this.cmd.blockPos.Z}`);

        for (let x=0; x<15; x++){
            for (let y=0; y<15; y++){
                for (let z=0; z<15; z++){
                    const pos = new Pos(x,y,z);
                    await this.renderBlock(pos);
                }
            }
        }
    }

    isOccluded(intrablockpos, direction) {
        const otherpos = intrablockpos.add(direction);
        if (otherpos.X > 15 || otherpos.X < 0 ||
            otherpos.Y > 15 || otherpos.Y < 0 ||
            otherpos.Z > 15 || otherpos.Z < 0) {
                // not in this mapblock
                return false;
            }

        const otherNodeId = this.cmd.blockData.GetNodeID(otherpos);
        return otherNodeId != 126;
    }

    async addMesh(nodeid, matrix) {
        const material = await this.textureManager.getMaterial(nodeid);
        if (!material){
            return;
        }
        let im = this.instanceMap.get(nodeid);
        if (!im) {
            //TODO: dynamic instance-count (pre-count?)
            im = new THREE.InstancedMesh(sideGeometry, material, 1024);
            this.instanceMap.set(nodeid, im);
        }

        im.setMatrixAt(im.count++, matrix);
    }

    async renderBlock(intrablockpos) {
        const abspos = intrablockpos.add(this.posOffset);
        const nodeid = this.cmd.blockData.GetNodeID(intrablockpos);
        if (nodeid > 22){
            return;
        }
        let rotation, translation;

        console.log(`Rendering block at ${abspos.X}/${abspos.Y}/${abspos.Z} nodeid=${nodeid}`);

        if (!this.isOccluded(intrablockpos, new Pos(0,1,0))){
            rotation = new THREE.Matrix4().makeRotationX(Math.PI/2);
            translation = new THREE.Matrix4().makeTranslation(abspos.X, abspos.Y+0.5, abspos.Z);
        }

        //TODO: more sides

        if (translation && rotation){
            const matrix = translation.multiply(rotation);
            this.addMesh(nodeid, matrix);
        }

    }
}