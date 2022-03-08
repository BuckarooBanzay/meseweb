import { Pos } from "./pos.js";

QUnit.module("pos");
QUnit.test("toString works as expected", assert => {
    const p = new Pos(1,2,3);
    assert.equal(""+p, "1/2/3", "pattern matches");
});