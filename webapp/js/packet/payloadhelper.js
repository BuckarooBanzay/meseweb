
export class PayloadHelper {
    constructor(dv){
        this.dv = dv;
    }

    getBoolean(offset, mask) {
        return (this.dv.getUint8(offset) & mask) == mask;
    }

    getArray(offset) {
        const len = this.dv.getUint16(offset);
        const a = new Array(len);
        for (let i=0; i<len; i++){
            a[i] = this.dv.getUint8(offset+i+2);
        }
        return a;
    }

    getUint8Array(offset) {
        const buf = new Uint8Array(this.dv.buffer);
        const len = this.dv.getUint32(offset);
        const subOffset = this.dv.byteOffset+offset+4;
        return buf.subarray(subOffset, subOffset+len);
    }

    getUint8ArraySize(buf) {
        return 4+buf.byteLength;
    }

    getString(offset) {
        const len = this.dv.getUint16(offset);
        let str = "";
        for (let i=0; i<len; i++){
            str += String.fromCharCode(this.dv.getUint8(offset+2+i));
        }
        return str;
    }

}