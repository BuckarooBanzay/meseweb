import { PayloadHelper } from "../command/packet/PayloadHelper";
import { TileAnimationType, TileDefinition } from "./TileDefinition";

export function ParseTileDefinition(dv: DataView): TileDefinition {
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

    td.offset = offset
    return td
}