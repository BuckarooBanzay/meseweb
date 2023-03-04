import { PayloadHelper } from "../command/packet/PayloadHelper";

export const TileAnimationType = {
    TAT_NONE: 0,
    TAT_VERTICAL_FRAMES: 1,
    TAT_SHEET_2D: 2
};

export class TileDefinition {

    version!: number
    name!: string
    animationType!: number
    aspect_w?: number
    aspect_h?: number
    animation_length?: number

    backfaceCulling!: boolean
    tileablehorizontal!: boolean
    tileableVertical!: boolean
    hasColor!: boolean
    hasScale!: boolean
    hasAlignStyle!: boolean

    red?: number
    green?: number
    blue?: number

    scale?: number
    alignStyle?: number

    offset!: number
}