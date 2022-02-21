
import * as srp from "secure-remote-password/client"
import { Client } from "./client"
import { ClientFirstSRP } from "./commands/client_first_srp"
import { ClientInit } from "./commands/client_init"
import { ClientInit2 } from "./commands/client_init2"
import { ClientSRPBytesA } from "./commands/client_srp_bytes_a"
import { ClientSRPBytesM } from "./commands/client_srp_bytes_m"
import { ServerAccessDenied } from "./commands/server_access_denied"
import { ServerAuthAccept } from "./commands/server_auth_accept"
import { ServerHello } from "./commands/server_hello"
import { ServerSRPBytesSB } from "./commands/server_srp_bytes_s_b"
import { ServerTimeOfDay } from "./commands/server_time_of_day"
import { PacketType } from "./packet/types"
import { arrayToHex, hexToArray } from "./util/hex"

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

const username = "test"
const password = "enter"

const client = new Client(ws)
client.addReadyListener(function(c){
    setTimeout(function(){
        console.log("Sending INIT")
        c.sendCommand(new ClientInit(username), PacketType.Original)
    }, 100)
})

const eph = srp.generateEphemeral()

client.addCommandListener(function(cmd){
    console.log(`Received command: ${JSON.stringify(cmd)}`)
    if (cmd instanceof ServerHello){
        console.log("Got server hello")

        if (cmd.authMechanismFirstSrp) {
            const salt = srp.generateSalt()
            const privateKey = srp.derivePrivateKey(salt, username, password)
            const verifier = srp.deriveVerifier(privateKey)
            client.sendCommand(new ClientFirstSRP(hexToArray(salt), hexToArray(verifier)))

        } else if (cmd.authMechanismSrp) {
            const a = hexToArray(eph.public)
            client.sendCommand(new ClientSRPBytesA(a))

        }
    }

    if (cmd instanceof ServerSRPBytesSB) {
        console.log("Got server bytes S+B")

        const serverSalt = arrayToHex(cmd.bytesS)
        const serverPublic = arrayToHex(cmd.bytesB)

        const privateKey = srp.derivePrivateKey(serverSalt, username, password)
        const clientSession = srp.deriveSession(eph.secret, serverPublic, serverSalt, username, privateKey)

        const proof = hexToArray(clientSession.proof)
        client.sendCommand(new ClientSRPBytesM(proof))
    }

    if (cmd instanceof ServerTimeOfDay) {
        console.log("Got server time of day: " + cmd.timeOfday)
    }

    if (cmd instanceof ServerAccessDenied) {
        console.log("Server access denied")
    }

    if (cmd instanceof ServerAuthAccept) {
        console.log("Server access granted")
        client.sendCommand(new ClientInit2())
    }
})

