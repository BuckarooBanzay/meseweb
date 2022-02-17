
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
        return this.data[offset+1] + (this.data[offset] * 256)
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