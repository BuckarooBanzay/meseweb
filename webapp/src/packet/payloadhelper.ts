
export class PayloadHelper {
    constructor(public dv: DataView){}

    getBoolean(offset: number, mask: number): boolean {
        return (this.dv.getUint8(offset) & mask) == mask
    }

    getArray(offset: number): number[] {
        const len = this.dv.getUint16(offset)
        const a = new Array<number>(len)
        for (let i=0; i<len; i++){
            a[i] = this.dv.getUint8(offset+i+2)
        }
        return a
    }

    getString(offset: number): string {
        const len = this.dv.getUint16(offset)
        let str = ""
        for (let i=0; i<len; i++){
            str += String.fromCharCode(this.dv.getUint8(offset+2+i))
        }
        return str
    }

}