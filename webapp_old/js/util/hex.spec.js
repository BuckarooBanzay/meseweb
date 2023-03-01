import { arrayToHex } from './hex.js';

QUnit.module("hex");
QUnit.test("converts to hex properly", assert => {
    const a = [1,2,3];
    const str = arrayToHex(a);
    assert.equal(str, "010203");
});