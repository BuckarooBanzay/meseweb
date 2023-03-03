
import NodeWebSocket from "ws"
import { env } from "process"
import { CommandClient } from "./CommandClient"
import { createPeerInit } from "../packet/packetfactory"
import Logger from "js-logger"

describe("CommandClient", function(){

    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    Logger.useDefaults({ defaultLevel: Logger.DEBUG })

    test("connect", function(done){
        const host = "minetest"
        const port = 30000
        const url = `ws://server:8080/api/ws?host=${host}&port=${port}`

        Logger.debug("connecting to: ", url)
        const ws = new NodeWebSocket(url);
        const cc = new CommandClient(ws as unknown as WebSocket)

        ws.onopen = function() {
            cc.SendPacket(createPeerInit())
            done()
            ws.close()
        }
    })
})