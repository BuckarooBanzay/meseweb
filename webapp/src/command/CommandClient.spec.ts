
import NodeWebSocket from "ws"
import { env } from "process"
import { CommandClient } from "./CommandClient"
import Logger from "js-logger"
import { ServerHello } from "./server/ServerHello"
import { ClientInit } from "./client/ClientInit"
import { PacketType } from "./packet/types"
import srp from "secure-remote-password/client"
import { ClientFirstSRP } from "./client/ClientFirstSRP"
import { arrayToHex, hexToArray } from "../util/hex"
import { ClientSRPBytesA } from "./client/ClientSRPBytesA"
import { ServerSRPBytesSB } from "./server/ServerSRPBytesSB"
import { ClientSRPBytesM } from "./client/ClientSRPBytesM"
import { ServerAuthAccept } from "./server/ServerAuthAccept"
import { ClientInit2 } from "./client/ClientInit2"

describe("CommandClient", function(){

    if (env.INTEGRATION_TEST != "true") {
        test.only("skip", function() {})
    }

    //Logger.useDefaults({ defaultLevel: Logger.DEBUG })

    test("connect", function(done){
        const host = "minetest"
        const port = 30000
        const url = `ws://server:8080/api/ws?host=${host}&port=${port}`

        const username = "test"
        const password = "enter"

        Logger.debug("connecting to: ", url)
        const ws = new NodeWebSocket(url);
        const cc = new CommandClient(ws as unknown as WebSocket)

        const eph = srp.generateEphemeral()

        cc.OnReady()
        .then(() => cc.PeerInit())
        .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
        .then(() => cc.SendCommandAndWait(new ClientInit("test"), PacketType.Original, ServerHello))
        .then(sh => {
            if (sh.authMechanismFirstSrp) {
                const salt = srp.generateSalt()
                const private_key = srp.derivePrivateKey(salt, username, password)
                const verifier = srp.deriveVerifier(private_key)
                const cmd = new ClientFirstSRP(hexToArray(salt), hexToArray(verifier))
                return cc.SendCommandAndWait(cmd, PacketType.Reliable, ServerSRPBytesSB)

            } else {
                const cmd = new ClientSRPBytesA(hexToArray(eph.public))
                return cc.SendCommandAndWait(cmd, PacketType.Reliable, ServerSRPBytesSB)
            }
        })
        .then(cmd => {
            const serverSalt = arrayToHex(cmd.bytesS);
            const serverPublic = arrayToHex(cmd.bytesB);
    
            const privateKey = srp.derivePrivateKey(serverSalt, username, password);
            const clientSession = srp.deriveSession(eph.secret, serverPublic, serverSalt, username, privateKey);
    
            const proof = hexToArray(clientSession.proof);
            return cc.SendCommandAndWait(new ClientSRPBytesM(proof), PacketType.Reliable, ServerAuthAccept);
        })
        .then(cmd => {
            expect(cmd.posX != undefined).toBeTruthy()
            expect(cmd.posY != undefined).toBeTruthy()
            expect(cmd.posZ != undefined).toBeTruthy()
            expect(cmd.seed.length).toBeGreaterThan(0)
            expect(cmd.sendInterval).toBeGreaterThan(0)
            return cc.SendCommand(new ClientInit2)
        })
        //.then(() => new Promise(resolve => setTimeout(resolve, 2000)))
        .then(() => {
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