
declare module 'zlibjs/bin/zlib_and_gzip.min.js' {

    class ZlibOptions {
        verify: boolean
    }

    export namespace Zlib {
        export class Inflate {
            constructor(buf: Uint8Array, opts?: ZlibOptions);
            decompress(): Uint8Array;
        }
    }



}