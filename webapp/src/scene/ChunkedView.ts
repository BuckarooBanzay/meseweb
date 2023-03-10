import { Mesh } from "three";
import { Pos, PosType } from "../util/pos";

export class ChunkedView {
    meshes = new Array<Mesh>
    constructor(public pos1: Pos<PosType.Mapblock>, public pos2: Pos<PosType.Mapblock>) {}
}
