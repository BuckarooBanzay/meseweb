declare module 'pako' {
    class InflateOptions {
        raw: boolean
    }

    export class Inflate {
        constructor(opts?: InflateOptions)
        push(chunk: Uint8Array, finished: boolean): void

        error: Error
        ended: boolean
        result: Uint8Array
    }

    function deflate(input: Uint8Array): Uint8Array;
    function inflate(input: Uint8Array, options?: InflateOptions): Uint8Array;
}
