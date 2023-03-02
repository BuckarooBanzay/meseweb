
import NodeWebSocket from "ws"
import { env } from "process"
import { CommandClient } from "./CommandClient"
import { createPeerInit } from "../packet/packetfactory"

describe("CommandClient", function(){

    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    test("connect", function(done){
        const host = "minetest"
        const port = 30000
        const ws = new NodeWebSocket(`ws://server:8080/api/ws?host=${host}&port=${port}`);
        const cc = new CommandClient(ws as unknown as WebSocket)

        ws.onopen = function() {
            cc.SendPacket(createPeerInit())
            done()
            ws.close()
        }
    })
})