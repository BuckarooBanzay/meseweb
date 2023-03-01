import { ServerNodeDefinitions } from './server_node_definitions.js';

QUnit.module("server_node_definitions");
QUnit.test("unmarshals the data properly", assert => {
    const done = assert.async();
    fetch("js/commands/testdata/server_nodedefs.json")
    .then(r => r.json())
    .then(testdata => {
        const cmd = new ServerNodeDefinitions();
        const buf = Uint8Array.from(testdata);
        const dv = new DataView(buf.buffer);
        cmd.UnmarshalPacket(dv);

        assert.equal(cmd.count, 446);
        assert.equal(cmd.version, 1);
        assert.equal(cmd.definitions.length, 446);

        /*
        cmd.definitions.forEach(d => {
            if (d.name == "default:lava_flowing" || d.name == "default:stone" || d.name == "doors:door_glass_c" || d.name == "default:glass") {
                console.log(JSON.stringify(d))
            }
        })
        */
       done();
    });
});
