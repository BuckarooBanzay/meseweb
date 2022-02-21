import { ServerCommand } from "./command"
import pako from 'pako'
import { PayloadHelper } from "../packet/payloadhelper"

export enum TileAnimationType {
    TAT_NONE = 0,
    TAT_VERTICAL_FRAMES = 1,
    TAT_SHEET_2D = 2
}

export class TileDefinition {
    version = 0
    name = ""
    animationType: TileAnimationType = 0
    aspect_w = 0
    aspect_h = 0
    animation_length = 0

    backfaceCulling = false
    tileablehorizontal = false
    tileableVertical = false
    hasColor = false
    hasScale = false
    hasAlignStyle = false

    red = 0
    green = 0
    blue = 0

    scale = 0
    alignStyle = 0

    Unmarshal(dv: DataView): number {
        const ph = new PayloadHelper(dv)
        let offset = 0
        this.version = dv.getUint8(offset++)
        if (this.version != 6){
            throw new Error("invalid tiledefinition version: " + this.version)
        }

        this.name = ph.getString(offset)
        offset+=2+this.name.length

        this.animationType = dv.getUint8(offset++)

        if (this.animationType == TileAnimationType.TAT_VERTICAL_FRAMES){
            this.aspect_w = dv.getUint16(offset)
            offset+=2
            this.aspect_h = dv.getUint16(offset)
            offset+=2
            this.animation_length = dv.getFloat32(offset)
            offset+=4
        } else if (this.animationType == TileAnimationType.TAT_SHEET_2D){
            this.aspect_w = dv.getUint8(offset++)
            this.aspect_h = dv.getUint8(offset++)
            this.animation_length = dv.getFloat32(offset)
            offset+=4
        }

        const flags = dv.getUint8(offset++)

        this.backfaceCulling = (flags & 0x01) == 0x01
        this.tileablehorizontal = (flags & 0x02) == 0x02
        this.tileableVertical = (flags & 0x04) == 0x04
        this.hasColor = (flags & 0x08) == 0x08
        this.hasScale = (flags & 0x10) == 0x10
        this.hasAlignStyle = (flags & 0x20) == 0x20

        if (this.hasColor){
            this.red = dv.getUint8(offset++)
            this.green = dv.getUint8(offset++)
            this.blue = dv.getUint8(offset++)
        }

        if (this.hasScale){
            this.scale = dv.getUint8(offset++)
        }

        if (this.hasAlignStyle){
            this.alignStyle = dv.getUint8(offset++)
        }

        return offset
    }
}

export class NodeDefinition {
    id = 0
    version = 0
    name = ""
    groups: { [key: string]: number } = {}
    paramtype1 = 0
    paramtype2 = 0
    drawType = 0
    mesh = ""
    visualScale = 0.0
    tileDefs = new Array<TileDefinition>(6)
    tileDefOverlays = new Array<TileDefinition>(6)

    Unmarshal(dv: DataView) {
        const ph = new PayloadHelper(dv)
        let offset = 0
        this.version = dv.getUint8(offset++)

        this.name = ph.getString(offset)
        offset+=2+this.name.length

        const groupsize = dv.getUint16(offset)
        offset+=2

        for (let i=0; i<groupsize; i++){
            const groupname = ph.getString(offset)
            offset+=2+groupname.length

            const value = dv.getInt16(offset)
            offset+=2

            this.groups[groupname] = value
        }

        this.paramtype1 = dv.getUint8(offset++)
        this.paramtype2 = dv.getUint8(offset++)
        this.drawType = dv.getUint8(offset++)
        this.mesh = ph.getString(offset)
        offset+=2+this.mesh.length
        
        this.visualScale = dv.getFloat32(offset)
        offset+=4

        const tiledefCount = dv.getUint8(offset++)
        if (tiledefCount != 6){
            throw new Error("invalid tiledefCount: " + tiledefCount)
        }
        for (let i=0; i<tiledefCount; i++){
            const td = new TileDefinition()
            const size = td.Unmarshal(new DataView(dv.buffer, dv.byteOffset+offset))
            console.log(size)
            //offset += size //TODO: fix offset issue
            this.tileDefs[i] = td
        }


    }
}

export class ServerNodeDefinitions implements ServerCommand {
    version = 0
    count = 0
    definitions = new Array<NodeDefinition>();

    UnmarshalPacket(dv: DataView): void {
        const input = dv.buffer.slice(dv.byteOffset + 4)
        const buf = new Uint8Array(input)
        const output = pako.inflate(buf)
        const dataView = new DataView(output.buffer)
        const ph = new PayloadHelper(dataView)
        this.version = dataView.getUint8(0)
        this.count = dataView.getUint16(1)

        const nodedefs_size = dataView.getUint16(3)
        let offset = 7

        for (let i=0; i<this.count; i++){
            const def = new NodeDefinition()
            this.definitions.push(def)

            def.id = dataView.getUint16(offset)
            offset+=2

            const nodedef_size = dataView.getUint16(offset)
            offset+=2

            const nodedefView = new DataView(output.buffer, offset)
            def.Unmarshal(nodedefView)

            offset+=nodedef_size
        }
    }

}