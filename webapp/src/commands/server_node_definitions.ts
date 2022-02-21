import { ServerCommand } from "./command"
import pako from 'pako'

export class NodeDefinition {
    id = 0
}

export class ServerNodeDefinitions implements ServerCommand {
    version = 0
    count = 0
    definitions = new Array<NodeDefinition>();

    UnmarshalPacket(dv: DataView): void {
        const input = dv.buffer.slice(dv.byteOffset + 4)
        const buf = new Uint8Array(input)
        const output = pako.inflate(buf)

        console.log(`Inflated data, before: ${input.byteLength}, after: ${output.byteLength}`)
    }

}