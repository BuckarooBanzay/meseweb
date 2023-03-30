import Logger from "js-logger";
import { InstancedMesh, Material, Matrix4, PlaneGeometry } from "three";
import { NodeDefinition, NodeDrawType } from "../nodedefs/NodeDefinition";
import { Iterator, MapblockPositions, Pos, PosType, getNodeRegion, CardinalNodeDirections, Directions } from "../util/pos";
import { ChunkedView } from "./ChunkedView";
import { MaterialManager } from "./MaterialManager";
import { WorldMap } from "./WorldMap";

const rotations = {
    X_NEG: new Matrix4().makeRotationY(-Math.PI/2),
    X_POS: new Matrix4().makeRotationY(Math.PI/2),
    Y_NEG: new Matrix4().makeRotationX(Math.PI/2),
    Y_POS: new Matrix4().makeRotationX(-Math.PI/2),
    Z_NEG: new Matrix4().makeRotationX(Math.PI),
    Z_POS: new Matrix4()
}

const face_offsets = {
    X_NEG: new Pos<PosType.Node>(-0.5, 0, 0),
    X_POS: new Pos<PosType.Node>(0.5, 0, 0),
    Y_NEG: new Pos<PosType.Node>(0, -0.5, 0),
    Y_POS: new Pos<PosType.Node>(0, 0.5, 0),
    Z_NEG: new Pos<PosType.Node>(0, 0, -0.5),
    Z_POS: new Pos<PosType.Node>(0, 0, 0.5)
};

const AIR_NODEID = 126

const side_geometry = new PlaneGeometry(1, 1);

export class ChunkedViewManager {

    // airlike nodeids
    nodeids_airlike = new Map<number, boolean>()

    // node-ids that occlude neighbors
    nodeids_occlude = new Map<number, boolean>()

    constructor(public wm: WorldMap, public mm: MaterialManager, public nodedefs: Map<number, NodeDefinition>) {
        this.nodeids_airlike.set(AIR_NODEID, true) // air
        nodedefs.forEach((nd, id) => {
            switch (nd.drawType) {
                case NodeDrawType.NDT_AIRLIKE:
                    this.nodeids_airlike.set(id, true)
                    break
                case NodeDrawType.NDT_NORMAL:
                    this.nodeids_occlude.set(id, true)
            }
        })
    }

    create(pos1: Pos<PosType.Mapblock>, pos2: Pos<PosType.Mapblock>): ChunkedView {
        Logger.debug(`Creating chunked view for ${pos1} to ${pos2}`)
        const cv = new ChunkedView(pos1, pos2)
    
        // material-uuid -> material
        const materials = new Map<string, Material>()

        // material-uuid -> matrix4[]
        const matrices = new Map<string, Array<Matrix4>>()

        const promises = new Array<Promise<Material|null>>()

        // for each mapblock
        Iterator(pos1, pos2).forEach(p => {
            const b = this.wm.getBlock(p)
            if (!b) {
                return
            }

            if (b.blockMapping.size == 1 && b.blockMapping.has(AIR_NODEID)){
                // air only
                return
            }

            const r = getNodeRegion(p)

            // for each node
            MapblockPositions.forEach(intrablock_nodepos => {
                const nodeid = b.getNodeID(intrablock_nodepos)
                if (this.nodeids_airlike.get(nodeid)) {
                    // don't render airlike nodes
                    return
                }

                // for each cardinal direction
                const nodepos = r[0].add(intrablock_nodepos)
                CardinalNodeDirections.forEach(dir => {
                    const neighbor_pos = nodepos.add(dir)
                    const neighbor_nodeid = this.wm.getNodeID(neighbor_pos)

                    if (!neighbor_nodeid || this.nodeids_occlude.get(neighbor_nodeid)) {
                        // face/direction is occluded or not generated
                        return
                    }

                    const node = this.wm.getNode(nodepos)
                    if (!node) {
                        // node-def not found
                        return
                    }

                    // render node face
                    const material = this.mm.getMaterial(nodeid, dir)
                    if (material == undefined) {
                        // no material generated
                        return
                    }

                    if (!materials.has(material.uuid)){
                        // create material entries
                        materials.set(material.uuid, material)
                        matrices.set(material.uuid, new Array<Matrix4>())
                    }

                    const matrix_list = matrices.get(material.uuid)!
                    let rotation: Matrix4
                    let offset: Pos<PosType.Node>

                    switch (dir) {
                        case Directions.Z_POS:
                            rotation = rotations.Z_POS
                            offset = face_offsets.Z_POS
                            break
                        case Directions.Z_NEG:
                            rotation = rotations.Z_NEG
                            offset = face_offsets.Z_NEG
                            break
                        case Directions.Y_POS:
                            rotation = rotations.Y_POS
                            offset = face_offsets.Y_POS
                            break
                        case Directions.Y_NEG:
                            rotation = rotations.Y_NEG
                            offset = face_offsets.Y_NEG
                            break
                        case Directions.X_POS:
                            rotation = rotations.X_POS
                            offset = face_offsets.X_POS
                            break
                        case Directions.X_NEG:
                            rotation = rotations.X_NEG
                            offset = face_offsets.X_NEG
                            break
                    }

                    const face_pos = nodepos.add(offset!)
                    const m = new Matrix4().makeTranslation(face_pos.x, face_pos.y, face_pos.z)
                    matrix_list.push(m.multiply(rotation!))
                })

            })
        });

        materials.forEach((material) => {
            const matrix_list = matrices.get(material.uuid)!
            const mesh = new InstancedMesh(side_geometry, material, matrix_list.length)
            matrix_list.forEach((m, i) => mesh.setMatrixAt(i, m))
            cv.meshes.push(mesh)
        })

        return cv
    }

}