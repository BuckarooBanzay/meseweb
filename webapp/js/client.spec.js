import { Client } from './client.js';

QUnit.module("client");
QUnit.test("emits events properly", assert => {
    var openFn, messageFn;
    let closed = false;
    let sentMessages = [];
    const mockSocket = {
        addEventListener(key, fn){
            if (key == "open"){
                openFn = fn;
            } else if (key == "message") {
                messageFn = fn;
            }
        },
        send(buf){
            sentMessages.push(buf);
        },
        close(){
            closed = true;
        }
    };

    const c = new Client(mockSocket);
    openFn();
    assert.equal(closed, false, "not closed");
    assert.equal(sentMessages.length, 1, "sent INIT");
    sentMessages = [];
    
    c.close();
    assert.equal(closed, true, "closed");
    assert.equal(sentMessages.length, 1, "sent DISCO");
});