
export class Payload {
    data: number[]

    constructor(data?: number[]){
        this.data = data || []
    }

    appendUint8(v: number) {
        this.data.push(v)
    }

    appendUint16(v: number) {
        this.data.push((v >> 8) & 0xFF)
        this.data.push(v & 0xFF)
    }

    appendString(s: string) {
        this.appendUint16(s.length)
        for (let i=0; i<s.length; i++){
            this.data.push(s.charCodeAt(i))
        }
    }

    appendArray(a: number[]){
        this.appendUint16(a.length)
        for (let i=0; i<a.length; i++){
            this.appendUint8(a[i])
        }
    }

    appendPayload(p: Payload) {
        this.data = this.data.concat(p.data)
    }

    getUint8(offset: number): number {
        return this.data[offset]
    }

    getUint16(offset: number): number {
        return (this.data[offset] * 256) +
            this.data[offset+1]
    }

    getUint32(offset: number): number {
        return (this.data[offset] * 256 * 256 * 256) +
            (this.data[offset+1] * 256 * 256) +
            (this.data[offset+2] * 256) +
            this.data[offset+3]
    }

    getUint64(offset: number): bigint {
        const buf = new ArrayBuffer(8)
        const dv = new DataView(buf)
        for (let i=offset; i<offset+8; i++){
            dv.setUint8(i-offset, this.data[offset])
        }

        return dv.getBigUint64(0)
    }

    getFloat32(offset: number): number {
        const buf = new ArrayBuffer(4)
        const dv = new DataView(buf)
        for (let i=offset; i<offset+4; i++){
            dv.setUint8(i-offset, this.data[offset])
        }

        return dv.getFloat32(0)
    }

    getBoolean(offset: number, mask: number): boolean {
        return (this.data[offset] & mask) == mask
    }

    getArray(offset: number): number[] {
        const len = this.getUint16(offset)
        return this.data.slice(offset+2, offset+2+len)
    }

    toUint8Array(): Uint8Array {
        return new Uint8Array(this.data)
    }

    subPayload(offset: number): Payload {
        return new Payload(this.data.slice(offset))
    }
}