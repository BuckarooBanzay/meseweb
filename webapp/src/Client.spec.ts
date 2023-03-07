import NodeWebSocket from "ws"
import { env } from "process"
import Logger from "js-logger"
import { CommandClient } from "./command/CommandClient"
import { Client } from "./Client"
import { ClientInit2 } from "./command/client/ClientInit2"

describe("Client", function() {
    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    //Logger.useDefaults({ defaultLevel: Logger.DEBUG })

    test("Login", function(done){
        const host = "minetest"
        const port = 30000
        const url = `ws://server:8080/api/ws?host=${host}&port=${port}`

        const username = "test"
        const password = "enter"

        Logger.debug("connecting to: ", url)
        const ws = new NodeWebSocket(url);
        const cc = new CommandClient(ws as unknown as WebSocket)
        const client = new Client(cc)

        client.login(username, password)
        .then(() => {
            return cc.sendCommand(new ClientInit2())
        })
        .then(() => {
            return new Promise(resolve => setTimeout(resolve, 2000))
        })
        .then(() => {
            done()
        })
        .catch(e => {
            Logger.error(e)
            done(e)
        })
        .finally(() => {
            cc.close()
        })
    })
})