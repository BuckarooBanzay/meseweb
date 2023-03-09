import { Mesh } from "three";
import { Pos } from "../util/pos";

export class ChunkedView {
    meshes = new Array<Mesh>
    constructor(public pos1: Pos, public pos2: Pos) {}
}
