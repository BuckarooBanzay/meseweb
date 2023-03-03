
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
            if (sh.authMechanismFirstSrp) {
                const salt = srp.generateSalt()
                const private_key = srp.derivePrivateKey(salt, username, password)
                const verifier = srp.deriveVerifier(private_key)
                const cmd = new ClientFirstSRP(hexToArray(salt), hexToArray(verifier))
                return cc.SendCommand(cmd)

            } else if (sh.authMechanismSrp) {
                const cmd = new ClientSRPBytesA(hexToArray(eph.public))
                return cc.SendCommand(cmd)
            }
        })
        .then(() => {
            return cc.WaitForCommand(ServerSRPBytesSB)
        })
        .then(cmd => {
            const serverSalt = arrayToHex(cmd.bytesS);
            const serverPublic = arrayToHex(cmd.bytesB);
    
            const privateKey = srp.derivePrivateKey(serverSalt, username, password);
            const clientSession = srp.deriveSession(eph.secret, serverPublic, serverSalt, username, privateKey);
    
            const proof = hexToArray(clientSession.proof);
            return cc.SendCommand(new ClientSRPBytesM(proof));
        })
        .then(() => {
            return cc.WaitForCommand(ServerAuthAccept);
        })
        .then(cmd => {
            expect(cmd.posX != undefined).toBeTruthy()
            expect(cmd.posY != undefined).toBeTruthy()
            expect(cmd.posZ != undefined).toBeTruthy()
            expect(cmd.seed.length).toBeGreaterThan(0)
            expect(cmd.sendInterval).toBeGreaterThan(0)
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