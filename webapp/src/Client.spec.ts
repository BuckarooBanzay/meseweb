import NodeWebSocket from "ws"
import { env } from "process"
import Logger from "js-logger"
import { CommandClient } from "./command/CommandClient"
import { Client } from "./Client"

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
        .then(() => client.mediamanager.size())
        .then(media_size => {
            expect(media_size).toBeGreaterThan(0)
            expect(client.nodedefs.size).toBeGreaterThan(0)
            done()
        })
        .catch(e => {
            Logger.error(e)
            done(e)
        })
        .finally(() => {
            client.close()
        })
    })
})