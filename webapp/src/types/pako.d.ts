declare module 'pako' {
    function deflate(input: Uint8Array): Uint8Array;
    function inflate(input: Uint8Array): Uint8Array;
}
