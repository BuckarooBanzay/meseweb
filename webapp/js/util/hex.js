
export function arrayToHex(a) {
    return a
    .map(n => n.toString(16))
    .map(s => s.length == 1 ? "0" + s : s)
    .join("");
}

export function stringToHex(str) {
    const a = new Array(str.length);
    for (let i=0; i<str.length; i++){
        a[i] = str.charCodeAt(i);
    }

    return a
    .map(n => n.toString(16))
    .map(s => s.length == 1 ? "0" + s : s)
    .join("");
}

export function hexToArray(s) {
    const a = new Array(s.length/2);
    for (let i=0; i<s.length/2; i++){
        a[i] = parseInt(s.substring(i*2, (i*2)+2), 16);
    }

    return a;
}