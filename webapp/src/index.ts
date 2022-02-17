
import * as srp from "secure-remote-password/client"
import { Client } from "./client"
import { ClientFirstSRP } from "./commands/client_first_srp"
import { ClientInit } from "./commands/client_init"
import { ClientSRPBytesA } from "./commands/client_srp_bytes_a"
import { ClientSRPBytesM } from "./commands/client_srp_bytes_m"
import { ServerHello } from "./commands/server_hello"
import { ServerSRPBytesSB } from "./commands/server_srp_bytes_s_b"
import { arrayToHex, hexToArray } from "./util/hex"

console.log("ok", srp)

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

const client = new Client(ws)
client.addReadyListener(function(c){
    setTimeout(function(){
        console.log("Sending INIT")
        c.sendCommand(new ClientInit("test"))
    }, 1000)
})

const eph = srp.generateEphemeral()
const username = "test"
const password = "enter"
const salt = srp.generateSalt()
const privateKey = srp.derivePrivateKey(salt, username, password)

client.addCommandListener(function(cmd){
    console.log("Received command: " + JSON.stringify(cmd))
    if (cmd instanceof ServerHello){
        console.log("Got server hello")

        if (cmd.authMechanismFirstSrp) {
            // works
            const verifier = srp.deriveVerifier(privateKey)
            const firstSrp = new ClientFirstSRP(hexToArray(salt), hexToArray(verifier))
            client.sendCommand(firstSrp)

        } else if (cmd.authMechanismSrp) {
            // Server: User test at 192.168.32.3 supplied wrong password (auth mechanism: SRP).
            const bytesA = new ClientSRPBytesA(hexToArray(eph.public))
            client.sendCommand(bytesA)

        }
    }

    if (cmd instanceof ServerSRPBytesSB) {
        console.log("Got server bytes S+B")

        const session = srp.deriveSession(eph.secret, arrayToHex(cmd.bytesB), salt, username, privateKey)
        const proof = hexToArray(session.proof)
        client.sendCommand(new ClientSRPBytesM(proof))
    }
})

