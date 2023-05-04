import { parseBlock } from "../block/blockparser"
import { ServerNodeDefinitions } from "../command/server/ServerNodeDefinitions"
import { InMemoryMediaManager } from "../media/InMemoryMediaManager"
import { NodeDefinition } from "../nodedefs/NodeDefinition"
import { ParseNodeDefinitions } from "../nodedefs/parser"
import { Pos, PosType } from "../util/pos"
import { MaterialManager } from "./MaterialManager"
import { MeshGenerator } from "./MeshGenerator"
import { blockdata, nodedef_data } from "./testdata"

describe("MeshGenerator", () => {
    test("createMesh", () => {
        const b = parseBlock(Uint8Array.from(blockdata), new Pos<PosType.Mapblock>(0,0,0))
        expect(b).toBeDefined()

        const buf = Uint8Array.from(nodedef_data);
        const dv = new DataView(buf.buffer);

        const cmd = new ServerNodeDefinitions()
        cmd.unmarshalPacket(dv)

        const deflist = ParseNodeDefinitions(cmd)
        expect(deflist.length).toEqual(446)

        const nodedefs = new Map<number, NodeDefinition>()
        deflist.forEach(def => nodedefs.set(def.id, def))

        const media = new InMemoryMediaManager()

        const mm = new MaterialManager(nodedefs, media)
        const mg = new MeshGenerator(mm, nodedefs)

        const mesh = mg.createMesh(b)
        expect(mesh).toBeDefined()

        //TODO

    })
})