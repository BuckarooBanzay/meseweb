import 'jest'
import { ServerNodeDefinitions } from './server_node_definitions'
const testdata = require('./testdata/server_nodedefs.json')


describe("server nodedefs command", function(){
    it("unmarshals the data properly", function(){
        const cmd = new ServerNodeDefinitions()
        const buf = Uint8Array.from(testdata)
        const dv = new DataView(buf.buffer)
        cmd.UnmarshalPacket(dv)

        expect(cmd.count).toBe(446)
        expect(cmd.version).toBe(1)
        expect(cmd.definitions.length).toBe(446)

        /*
        cmd.definitions.forEach(d => {
            if (d.name == "default:lava_flowing" || d.name == "default:stone" || d.name == "doors:door_glass_c" || d.name == "default:glass") {
                console.log(JSON.stringify(d))
            }
        })
        */
    })
})