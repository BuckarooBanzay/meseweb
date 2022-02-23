
import * as srp from "secure-remote-password/client"
import { Client } from "./client"
import { ClientFirstSRP } from "./commands/client_first_srp"
import { ClientInit } from "./commands/client_init"
import { ClientInit2 } from "./commands/client_init2"
import { ClientPlayerPos } from "./commands/client_player_pos"
import { ClientReady } from "./commands/client_ready"
import { ClientRequestMedia } from "./commands/client_request_media"
import { ClientSRPBytesA } from "./commands/client_srp_bytes_a"
import { ClientSRPBytesM } from "./commands/client_srp_bytes_m"
import { ServerAccessDenied } from "./commands/server_access_denied"
import { ServerAnnounceMedia } from "./commands/server_announce_media"
import { ServerAuthAccept } from "./commands/server_auth_accept"
import { ServerBlockData } from "./commands/server_block_data"
import { ServerCSMRestrictionFlags } from "./commands/server_csm_restriction_flags"
import { ServerHello } from "./commands/server_hello"
import { ServerMedia } from "./commands/server_media"
import { ServerNodeDefinitions } from "./commands/server_node_definitions"
import { ServerSRPBytesSB } from "./commands/server_srp_bytes_s_b"
import { ServerTimeOfDay } from "./commands/server_time_of_day"
import { MediaManager } from "./media/mediamanager"
import { PacketType } from "./packet/types"
import { arrayToHex, hexToArray } from "./util/hex"

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)

const username = "test"
const password = "enter"

const mediaManager = new MediaManager()
// filename -> hash as string[40]
let hashes: { [key: string]: string } = {}

const client = new Client(ws)
client.addReadyListener(function(c){
    setTimeout(function(){
        console.log("Sending INIT")
        c.sendCommand(new ClientInit(username), PacketType.Original)
    }, 100)
})

const eph = srp.generateEphemeral()

client.addCommandListener(async function(client, cmd){
    //console.log(`Received command: ${JSON.stringify(cmd)}`)
    if (cmd instanceof ServerHello){
        console.log(`Got server hello, protocol=${cmd.protocolVersion}`)

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
        console.log(`Server access granted, seed=${cmd.seed} x=${cmd.posX}, y=${cmd.posY}, z=${cmd.posZ}`)
        client.sendCommand(new ClientInit2())
    }

    if (cmd instanceof ServerAnnounceMedia){
        const localCount = await mediaManager.getMediaCount()
        console.log(`Server announced media, files=${cmd.fileCount}, localCount=${localCount}`)
        // store filename->hash association
        hashes = cmd.hashes

        const reqMedia = new ClientRequestMedia()
        const filenameList = Object.keys(hashes)
        for (let i=0; i<filenameList.length; i++){
            const fileName = filenameList[i]
            const hash = hashes[fileName]
            const hasMedia = await mediaManager.hasMedia(hash)
            if (!hasMedia){
                reqMedia.names.push(fileName)
            }
        }

        if (reqMedia.names.length > 0){
            console.log(`Requesting media, count=${reqMedia.names.length}`)
            client.sendCommand(reqMedia)
        }
    }

    if (cmd instanceof ServerNodeDefinitions){
        console.log(`Got ${cmd.count} node-definitions`, cmd.nodeMapping)
    }

    if (cmd instanceof ServerMedia){
        console.log(`Got server media bunches=${cmd.bunches} index=${cmd.index} numFiles=${cmd.numFiles}`, cmd.files)

        Object.keys(cmd.files).forEach(filename => {
            const hash = hashes[filename]
            const data = cmd.files[filename]
            mediaManager.addMedia(hash, filename, data)
        })
    }

    if (cmd instanceof ServerCSMRestrictionFlags){
        console.log("Got CSM restriction flags")
        client.sendCommand(new ClientReady())

        const ppos = new ClientPlayerPos()
        ppos.fov = 149
        ppos.requestViewRange = 13
        client.sendCommand(ppos, PacketType.Original)
    }

    if (cmd instanceof ServerBlockData){
        console.log(`Got block data ${cmd.blockPos.X}/${cmd.blockPos.Y}/${cmd.blockPos.Z}`, cmd.blockData.blockMapping)
    }
})

