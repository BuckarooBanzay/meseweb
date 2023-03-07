import { PayloadHelper } from "../command/packet/PayloadHelper";
import { TileAnimationType, TileDefinition } from "./TileDefinition";
import { NodeDefinition } from "./NodeDefinition";
import { ServerNodeDefinitions } from "../command/server/ServerNodeDefinitions";
import { inflateSync } from "zlib"

export function ParseTileDefinition(dv: DataView): [TileDefinition, number] {
    const td = new TileDefinition()

    const ph = new PayloadHelper(dv);
    let offset = 0;
    td.version = dv.getUint8(offset++);
    if (td.version != 6){
        throw new Error("invalid tiledefinition version: " + td.version);
    }

    td.name = ph.getString(offset);
    offset+=2+td.name.length;

    td.animationType = dv.getUint8(offset++);

    if (td.animationType == TileAnimationType.TAT_VERTICAL_FRAMES){
        td.aspect_w = dv.getUint16(offset);
        offset+=2;
        td.aspect_h = dv.getUint16(offset);
        offset+=2;
        td.animation_length = dv.getFloat32(offset);
        offset+=4;
    } else if (td.animationType == TileAnimationType.TAT_SHEET_2D){
        td.aspect_w = dv.getUint8(offset++);
        td.aspect_h = dv.getUint8(offset++);
        td.animation_length = dv.getFloat32(offset);
        offset+=4;
    }

    const flags = dv.getUint16(offset);
    offset+=2;

    td.backfaceCulling = (flags & 0x01) == 0x01;
    td.tileablehorizontal = (flags & 0x02) == 0x02;
    td.tileableVertical = (flags & 0x04) == 0x04;
    td.hasColor = (flags & 0x08) == 0x08;
    td.hasScale = (flags & 0x10) == 0x10;
    td.hasAlignStyle = (flags & 0x20) == 0x20;

    if (td.hasColor){
        td.red = dv.getUint8(offset++);
        td.green = dv.getUint8(offset++);
        td.blue = dv.getUint8(offset++);
    }

    if (td.hasScale){
        td.scale = dv.getUint8(offset++);
    }

    if (td.hasAlignStyle){
        td.alignStyle = dv.getUint8(offset++);
    }

    return [td, offset]
}

export function ParseNodeDefinition(dv: DataView): NodeDefinition {
    const nd = new NodeDefinition()
    
    const ph = new PayloadHelper(dv);
    let offset = 0;
    nd.version = dv.getUint8(offset++);

    nd.name = ph.getString(offset);
    offset+=2+nd.name.length;

    const groupsize = dv.getUint16(offset);
    offset+=2;

    for (let i=0; i<groupsize; i++){
        const groupname = ph.getString(offset);
        offset+=2+groupname.length;

        const value = dv.getInt16(offset);
        offset+=2;

        nd.groups.set(groupname, value);
    }

    nd.paramtype1 = dv.getUint8(offset++);
    nd.paramtype2 = dv.getUint8(offset++);
    nd.drawType = dv.getUint8(offset++);
    nd.mesh = ph.getString(offset);
    offset+=2+nd.mesh.length;
    
    nd.visualScale = dv.getFloat32(offset);
    offset+=4;

    const tiledefCount = dv.getUint8(offset++);
    if (tiledefCount != 6){
        throw new Error("invalid tiledefCount: " + tiledefCount);
    }
    for (let i=0; i<tiledefCount; i++){
        const [td, td_offset] = ParseTileDefinition(new DataView(dv.buffer, dv.byteOffset+offset))
        offset += td_offset
        nd.tileDefs[i] = td;
    }
    for (let i=0; i<tiledefCount; i++){
        const [td, td_offset] = ParseTileDefinition(new DataView(dv.buffer, dv.byteOffset+offset))
        offset += td_offset
        nd.tileDefOverlays[i] = td;
    }

    const specialTileCount = dv.getUint8(offset++);
    for (let i=0; i<specialTileCount; i++){
        const [td, td_offset] = ParseTileDefinition(new DataView(dv.buffer, dv.byteOffset+offset))
        offset += td_offset
        nd.tileSpecial[i] = td;
    }

    nd.legacyAlpha = dv.getUint8(offset++);
    nd.red = dv.getUint8(offset++);
    nd.green = dv.getUint8(offset++);
    nd.blue = dv.getUint8(offset++);
    nd.paletteName = ph.getString(offset);
    offset+=2+nd.paletteName.length;

    nd.waving = dv.getUint8(offset++);
    nd.connectSides = dv.getUint8(offset++);

    const connectToSize = dv.getUint16(offset);
    offset+=2;
    for (let i=0; i<connectToSize; i++){
        nd.connectsToId.push(dv.getUint16(offset));
        offset+=2;
    }

    nd.postEffectColor = dv.getUint32(offset);
    offset+=4;

    nd.leveled = dv.getUint8(offset++);
    nd.lightPropagates = dv.getUint8(offset++);
    nd.sunlightPropagates = dv.getUint8(offset++);
    nd.lightSource = dv.getUint8(offset++);
    nd.groundContent = dv.getUint8(offset++);

    // TODO: more data


    return nd
}

export function ParseNodeDefinitions(cmd: ServerNodeDefinitions): Array<NodeDefinition> {
    const defs = new Array<NodeDefinition>()

    const output = inflateSync(cmd.data)
    const dv = new DataView(output.buffer);

    const version = dv.getUint8(0);
    const count = dv.getUint16(1);

    if (version != 1) {
        throw new Error("invalid nodedef version: " + version)
    }

    let offset = 7;
    for (let i=0; i<count; i++){
        const id = dv.getUint16(offset);
        offset+=2;

        const nodedef_size = dv.getUint16(offset);
        offset+=2;

        const nodedefView = new DataView(dv.buffer, offset);
        const nodedef = ParseNodeDefinition(nodedefView)
        nodedef.id = id
        defs.push(nodedef)

        offset+=nodedef_size;
    }

    return defs
}