import { Pos, PosType } from "../../util/pos";

export class PayloadBuilder {

    private data: Array<number>

    constructor(data?: number[]) {
        this.data = data || new Array<number>()
    }

    appendUint8(v: number) {
        this.data.push(v);
    }

    appendUint16(v: number) {
        this.data.push((v >> 8) & 0xFF);
        this.data.push(v & 0xFF);
    }

    appendUint32(v: number){
        this.data.push((v >> 32) & 0xFF);
        this.data.push((v >> 16) & 0xFF);
        this.data.push((v >> 8) & 0xFF);
        this.data.push(v & 0xFF);
    }

    appendFloat32(v: number) {
        const a = new Uint8Array(4)
        const dv = new DataView(a.buffer)
        dv.setFloat32(0, v)
        this.appendUint8(dv.getUint8(0))
        this.appendUint8(dv.getUint8(1))
        this.appendUint8(dv.getUint8(2))
        this.appendUint8(dv.getUint8(3))
    }

    appendPos(p: Pos<PosType.Entity>) {
        this.appendUint32(p.x * 1000)
        this.appendUint32(p.y * 1000)
        this.appendUint32(p.z * 1000)
    }

    appendString(s: string) {
        this.appendUint16(s.length);
        for (let i=0; i<s.length; i++){
            this.data.push(s.charCodeAt(i));
        }
    }

    appendArray(a: Array<number>){
        this.appendUint16(a.length);
        for (let i=0; i<a.length; i++){
            this.appendUint8(a[i]);
        }
    }

    toUint8Array(): Uint8Array {
        return new Uint8Array(this.data);
    }

}