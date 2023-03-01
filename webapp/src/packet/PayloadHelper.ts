
export class PayloadHelper {
    constructor(public dv: DataView){
    }

    getBoolean(offset: number, mask: number): boolean {
        return (this.dv.getUint8(offset) & mask) == mask;
    }

    getArray(offset: number): Array<number> {
        const len = this.dv.getUint16(offset);
        const a = new Array<number>(len);
        for (let i=0; i<len; i++){
            a[i] = this.dv.getUint8(offset+i+2);
        }
        return a;
    }

    getUint8Array(offset: number): Uint8Array {
        const buf = new Uint8Array(this.dv.buffer);
        const len = this.dv.getUint32(offset);
        const subOffset = this.dv.byteOffset+offset+4;
        return buf.subarray(subOffset, subOffset+len);
    }

    getUint8ArraySize(buf: Uint8Array) {
        return 4+buf.byteLength;
    }

    getString(offset: number): string {
        const len = this.dv.getUint16(offset);
        let str = "";
        for (let i=0; i<len; i++){
            str += String.fromCharCode(this.dv.getUint8(offset+2+i));
        }
        return str;
    }
}