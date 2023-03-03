
import NodeWebSocket from "ws"
import { env } from "process"
import { CommandClient } from "./CommandClient"
import { createPeerInit } from "../packet/packetfactory"
import Logger from "js-logger"
import { ServerHello } from "./server/ServerHello"
import { ClientInit } from "./client/ClientInit"
import { PacketType } from "../packet/types"

describe("CommandClient", function(){

    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    //Logger.useDefaults({ defaultLevel: Logger.DEBUG })

    test("connect", function(done){
        const host = "minetest"
        const port = 30000
        const url = `ws://server:8080/api/ws?host=${host}&port=${port}`

        Logger.debug("connecting to: ", url)
        const ws = new NodeWebSocket(url);
        const cc = new CommandClient(ws as unknown as WebSocket)

        cc.OnReady()
        .then(() => {
            return cc.PeerInit()
        })
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 1000))
        })
        .then(() => {
            cc.SendCommand(new ClientInit("test"), PacketType.Original)
            return cc.WaitForCommand(ServerHello)
        })
        .then(sh => {
            //TODO
            Logger.debug(sh)
            done()
        })
        .catch(e => {
            done(e)
        })
        .finally(() => {
            cc.close()
        })
    })
})