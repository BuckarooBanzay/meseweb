
export class Payload {
    data: number[]

    constructor(data?: number[]){
        this.data = data || []
    }

    appendUint8(v: number) {
        this.data.push(v)
    }

    appendUint16() {
        //TODO
    }

    getUint8(offset: number): number {
        return this.data[offset]
    }

    getUint16(offset: number): number {
        //TODO: verify byte order
        return this.data[offset] + (this.data[offset] * 256)
    }
}