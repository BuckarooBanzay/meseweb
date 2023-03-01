
export class PayloadBuilder {

    constructor(data){
        this.data = data || [];
    }

    appendUint8(v) {
        this.data.push(v);
    }

    appendUint16(v) {
        this.data.push((v >> 8) & 0xFF);
        this.data.push(v & 0xFF);
    }

    appendUint32(v){
        this.data.push((v >> 32) & 0xFF);
        this.data.push((v >> 16) & 0xFF);
        this.data.push((v >> 8) & 0xFF);
        this.data.push(v & 0xFF);
    }

    appendString(s) {
        this.appendUint16(s.length);
        for (let i=0; i<s.length; i++){
            this.data.push(s.charCodeAt(i));
        }
    }

    appendArray(a){
        this.appendUint16(a.length);
        for (let i=0; i<a.length; i++){
            this.appendUint8(a[i]);
        }
    }

    toUint8Array() {
        return new Uint8Array(this.data);
    }

}