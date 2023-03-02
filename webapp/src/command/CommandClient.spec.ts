
import WebSocket from "ws"
import { env } from "process"

describe("CommandClient", function(){

    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    test("connect", function(done){
        const host = "minetest"
        const port = 30000
        const ws = new WebSocket(`ws://server:8080/api/ws?host=${host}&port=${port}`);
        ws.onopen = function() {
            done()
            ws.close()
        }
    })
})