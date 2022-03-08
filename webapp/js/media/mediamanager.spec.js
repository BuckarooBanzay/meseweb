import { MediaManager } from "./mediamanager.js";

QUnit.module("mediamanager");
QUnit.test("stores the assets properly", assert => {
    assert.timeout(1000);
    const done = assert.async();
    const mmgr = new MediaManager();

    mmgr.clear()
    .then(() => mmgr.getMediaCount())
    .then(count => {
        assert.equal(count, 0, "media purged");
        const data = new Uint8Array(10);
        return mmgr.addMedia("myhash", "myfilename", data);
    })
    .then(() => mmgr.getMediaCount())
    .then(count => {
        assert.equal(count, 1, "added file available");
        return mmgr.getMedia("myfilename");
    })
    .then(data => {
        assert.ok(data, "data retrieved");
        assert.equal(data.size, 10, "data size matched");
        done();
    });
});