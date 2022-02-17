
export function arrayToHex(a: number[]): string {
    return a
    .map(n => n.toString(16))
    .map(s => s.length == 1 ? "0" + s : s)
    .join("")
}

export function hexToArray(s: string): number[] {
    const a = new Array<number>(s.length/2)
    for (let i=0; i<s.length/2; i++){
        a[i] = parseInt(s.substring(i*2, (i*2)+2), 16)
    }

    return a
}