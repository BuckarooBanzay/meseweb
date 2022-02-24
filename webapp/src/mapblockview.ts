import { ServerBlockData } from "./commands/server_block_data";
import { ServerNodeDefinitions } from "./commands/server_node_definitions";
import { Scene } from "./scene";
import { TextureManager } from "./texturemanager";
import { Pos } from "./types/pos";
import { Matrix4, InstancedMesh, PlaneGeometry } from 'three'

const sideGeometry = new PlaneGeometry(1,1)

export class MapblockView {
    posOffset = new Pos(this.cmd.blockPos.X*16, this.cmd.blockPos.Y*16, this.cmd.blockPos.Z*16)

    constructor(public scene: Scene, public cmd: ServerBlockData, public textureManager: TextureManager, public nodedefs: ServerNodeDefinitions){}

    async render() {
        console.log(`Drawing mapblock ${this.cmd.blockPos.X}/${this.cmd.blockPos.Y}/${this.cmd.blockPos.Z}`)

        for (let x=0; x<15; x++){
            for (let y=0; y<15; y++){
                for (let z=0; z<15; z++){
                    const pos = new Pos(x,y,z)
                    await this.renderBlock(pos)
                }
            }
        }
    }

    isOccluded(intrablockpos: Pos, direction: Pos): boolean {
        const otherpos = intrablockpos.add(direction)
        if (otherpos.X > 15 || otherpos.X < 0 ||
            otherpos.Y > 15 || otherpos.Y < 0 ||
            otherpos.Z > 15 || otherpos.Z < 0) {
                // not in this mapblock
                return false
            }

        const otherNodeId = this.cmd.blockData.GetNodeID(otherpos)
        return otherNodeId != 126
    }

    instanceMap = new Map<number, InstancedMesh>()
    async addMesh(nodeid: number, matrix: Matrix4) {
        const material = await this.textureManager.getMaterial(nodeid)
        if (!material){
            return
        }
        let im = this.instanceMap.get(nodeid)
        if (!im) {
            //TODO: dynamic instance-count (pre-count?)
            im = new InstancedMesh(sideGeometry, material, 1024)
            this.instanceMap.set(nodeid, im)
        }

        im.setMatrixAt(im.count++, matrix)
    }

    async renderBlock(intrablockpos: Pos) {
        const abspos = intrablockpos.add(this.posOffset)
        const nodeid = this.cmd.blockData.GetNodeID(intrablockpos)
        let rotation: Matrix4|undefined
        var translation: Matrix4|undefined

        if (!this.isOccluded(intrablockpos, new Pos(0,1,0))){
            rotation = new Matrix4().makeRotationX(Math.PI/2)
            translation = new Matrix4().makeTranslation(abspos.X, abspos.Y+0.5, abspos.Z)
        }

        //TODO: more sides

        if (translation && rotation){
            const matrix = translation.multiply(rotation)
            this.addMesh(nodeid, matrix)
        }

    }
}