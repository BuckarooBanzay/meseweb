
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
        this.data.push(s.length)
        for (let i=0; i<s.length; i++){
            this.data.push(s.charCodeAt(i))
        }
    }

    getUint8(offset: number): number {
        return this.data[offset]
    }

    getUint16(offset: number): number {
        //TODO: verify byte order
        return this.data[offset+1] + (this.data[offset] * 256)
    }
}