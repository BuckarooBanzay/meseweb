import { ServerCommand } from "./command"
import * as zlib from "zlibjs/bin/zlib_and_gzip.min.js";
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

        const flags = dv.getUint16(offset)
        offset+=2

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

export enum NodeDrawType {
	// A basic solid block
	NDT_NORMAL = 0x00,
	// Nothing is drawn
	NDT_AIRLIKE = 0x01,
	// Do not draw face towards same kind of flowing/source liquid
	NDT_LIQUID = 0x02,
	// A very special kind of thing
	NDT_FLOWINGLIQUID = 0x03,
	// Glass-like, don't draw faces towards other glass
	NDT_GLASSLIKE = 0x04,
	// Leaves-like, draw all faces no matter what
	NDT_ALLFACES = 0x05,
	// Enabled -> ndt_allfaces, disabled -> ndt_normal
	NDT_ALLFACES_OPTIONAL = 0x06,
	// Single plane perpendicular to a surface
	NDT_TORCHLIKE = 0x07,
	// Single plane parallel to a surface
	NDT_SIGNLIKE = 0x08,
	// 2 vertical planes in a 'X' shape diagonal to XZ axes.
	// paramtype2 = "meshoptions" allows various forms, sizes and
	// vertical and horizontal random offsets.
	NDT_PLANTLIKE = 0x09,
	// Fenceposts that connect to neighbouring fenceposts with horizontal bars
	NDT_FENCELIKE = 0x0A,
	// Selects appropriate junction texture to connect like rails to
	// neighbouring raillikes.
	NDT_RAILLIKE = 0x0B,
	// Custom Lua-definable structure of multiple cuboids
	NDT_NODEBOX = 0x0C,
	// Glass-like, draw connected frames and all visible faces.
	// param2 > 0 defines 64 levels of internal liquid
	// Uses 3 textures, one for frames, second for faces,
	// optional third is a 'special tile' for the liquid.
	NDT_GLASSLIKE_FRAMED = 0x0D,
	// Draw faces slightly rotated and only on neighbouring nodes
	NDT_FIRELIKE = 0x0E,
	// Enabled -> ndt_glasslike_framed, disabled -> ndt_glasslike
	NDT_GLASSLIKE_FRAMED_OPTIONAL = 0x0F,
	// Uses static meshes
	NDT_MESH = 0x10,
	// Combined plantlike-on-solid
	NDT_PLANTLIKE_ROOTED = 0x11
}

export enum ContentParamType {
	CPT_NONE = 0x00,
	CPT_LIGHT = 0x01,
}

export enum ContentParamType2 {
	CPT2_NONE = 0x00,
	// Need 8-bit param2
	CPT2_FULL = 0x01,
	// Flowing liquid properties
	CPT2_FLOWINGLIQUID = 0x02,
	// Direction for chests and furnaces and such
	CPT2_FACEDIR = 0x03,
	// Direction for signs, torches and such
	CPT2_WALLMOUNTED = 0x04,
	// Block level like FLOWINGLIQUID
	CPT2_LEVELED = 0x05,
	// 2D rotation
	CPT2_DEGROTATE = 0x06,
	// Mesh options for plants
	CPT2_MESHOPTIONS = 0x07,
	// Index for palette
	CPT2_COLOR = 0x08,
	// 3 bits of palette index, then facedir
	CPT2_COLORED_FACEDIR = 0x09,
	// 5 bits of palette index, then wallmounted
	CPT2_COLORED_WALLMOUNTED = 0x0A,
	// Glasslike framed drawtype internal liquid level, param2 values 0 to 63
	CPT2_GLASSLIKE_LIQUID_LEVEL = 0x0B,
	// 3 bits of palette index, then degrotate
	CPT2_COLORED_DEGROTATE = 0x0C,
}

export class NodeDefinition {
    id = 0
    version = 0
    name = ""
    groups: { [key: string]: number } = {}
    paramtype1: ContentParamType = 0
    paramtype2: ContentParamType2 = 0
    drawType: NodeDrawType = 0
    mesh = ""
    visualScale = 0.0
    tileDefs = new Array<TileDefinition>(6)
    tileDefOverlays = new Array<TileDefinition>(6)
    tileSpecial = new Array<TileDefinition>()
    legacyAlpha = 0
    red = 0
    green = 0
    blue = 0
    paletteName = ""
    waving = 0
    connectSides = 0
    connectsToId = new Array<number>()
    postEffectColor = 0
    leveled = 0
    lightPropagates = 0
    sunlightPropagates = 0
    lightSource = 0
    groundContent = 0

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
            offset += td.Unmarshal(new DataView(dv.buffer, dv.byteOffset+offset))
            this.tileDefs[i] = td
        }
        for (let i=0; i<tiledefCount; i++){
            const td = new TileDefinition()
            offset += td.Unmarshal(new DataView(dv.buffer, dv.byteOffset+offset))
            this.tileDefOverlays[i] = td
        }

        const specialTileCount = dv.getUint8(offset++)
        for (let i=0; i<specialTileCount; i++){
            const td = new TileDefinition()
            offset += td.Unmarshal(new DataView(dv.buffer, dv.byteOffset+offset))
            this.tileSpecial[i] = td
        }

        this.legacyAlpha = dv.getUint8(offset++)
        this.red = dv.getUint8(offset++)
        this.green = dv.getUint8(offset++)
        this.blue = dv.getUint8(offset++)
        this.paletteName = ph.getString(offset)
        offset+=2+this.paletteName.length

        this.waving = dv.getUint8(offset++)
        this.connectSides = dv.getUint8(offset++)

        const connectToSize = dv.getUint16(offset)
        offset+=2
        for (let i=0; i<connectToSize; i++){
            this.connectsToId.push(dv.getUint16(offset))
            offset+=2
        }

        this.postEffectColor = dv.getUint32(offset)
        offset+=4

        this.leveled = dv.getUint8(offset++)
        this.lightPropagates = dv.getUint8(offset++)
        this.sunlightPropagates = dv.getUint8(offset++)
        this.lightSource = dv.getUint8(offset++)
        this.groundContent = dv.getUint8(offset++)

        // TODO: more data
    }
}

export class ServerNodeDefinitions implements ServerCommand {
    version = 0
    count = 0
    definitions = new Array<NodeDefinition>();

    UnmarshalPacket(dv: DataView): void {
        const input = dv.buffer.slice(dv.byteOffset + 4)
        const buf = new Uint8Array(input)
        const inflate = new zlib.Zlib.Inflate(buf)
        const output = inflate.decompress()
        const dataView = new DataView(output.buffer)
        this.version = dataView.getUint8(0)
        this.count = dataView.getUint16(1)
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