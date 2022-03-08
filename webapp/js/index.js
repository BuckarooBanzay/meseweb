
import { Client } from "./client.js";
import { ClientFirstSRP } from "./commands/client_first_srp.js";
import { ClientInit } from "./commands/client_init.js";
import { ClientInit2 } from "./commands/client_init2.js";
import { ClientPlayerPos } from "./commands/client_player_pos.js";
import { ClientReady } from "./commands/client_ready.js";
import { ClientRequestMedia } from "./commands/client_request_media.js";
import { ClientSRPBytesA } from "./commands/client_srp_bytes_a.js";
import { ClientSRPBytesM } from "./commands/client_srp_bytes_m.js";
import { ServerAccessDenied } from "./commands/server_access_denied.js";
import { ServerAnnounceMedia } from "./commands/server_announce_media.js";
import { ServerAuthAccept } from "./commands/server_auth_accept.js";
import { ServerBlockData } from "./commands/server_block_data.js";
import { ServerCSMRestrictionFlags } from "./commands/server_csm_restriction_flags.js";
import { ServerHello } from "./commands/server_hello.js";
import { ServerMedia } from "./commands/server_media.js";
import { ServerNodeDefinitions } from "./commands/server_node_definitions.js";
import { ServerSRPBytesSB } from "./commands/server_srp_bytes_s_b.js";
import { ServerTimeOfDay } from "./commands/server_time_of_day.js";
//import { MapblockView } from "./mapblockview.js";
import { MediaManager } from "./media/mediamanager.js";
import { PacketType } from "./packet/types.js";
import { Scene } from "./scene.js";
import { TextureManager } from "./texturemanager.js";
import { arrayToHex, hexToArray } from "./util/hex.js";

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000");
ws.onerror = console.log.bind(console);
ws.onclose = console.log.bind(console);

const username = "test";
const password = "enter";

const scene = new Scene();

const mediaManager = new MediaManager();
// filename -> hash as string[40]
let hashes = {};

let nodedefs, textureManager, mapblockCount = 0;

const client = new Client(ws);
client.addReadyListener(function(c){
    setTimeout(function(){
        console.log("Sending INIT");
        c.sendCommand(new ClientInit(username), PacketType.Original);
    }, 100);
});

const eph = srp.generateEphemeral();

let hasAllMedia = false;
let clientReadyTriggered = false;

function checkClientReady() {
    if (clientReadyTriggered || !hasAllMedia) {
        return;
    }
    clientReadyTriggered = true;

    console.log(`Sending CLIENT_READY`);
    client.sendCommand(new ClientReady());

    const ppos = new ClientPlayerPos();
    ppos.fov = 149;
    ppos.requestViewRange = 13;
    client.sendCommand(ppos, PacketType.Original);
}

client.addCommandListener(function(client, cmd){
    //console.log(`Received command: ${JSON.stringify(cmd)}`)
    if (cmd instanceof ServerHello){
        console.log(`Got server hello, protocol=${cmd.protocolVersion}`);

        if (cmd.authMechanismFirstSrp) {
            const salt = srp.generateSalt();
            const privateKey = srp.derivePrivateKey(salt, username, password);
            const verifier = srp.deriveVerifier(privateKey);
            client.sendCommand(new ClientFirstSRP(hexToArray(salt), hexToArray(verifier)));

        } else if (cmd.authMechanismSrp) {
            const a = hexToArray(eph.public);
            client.sendCommand(new ClientSRPBytesA(a));

        }
    }

    if (cmd instanceof ServerSRPBytesSB) {
        console.log("Got server bytes S+B");

        const serverSalt = arrayToHex(cmd.bytesS);
        const serverPublic = arrayToHex(cmd.bytesB);

        const privateKey = srp.derivePrivateKey(serverSalt, username, password);
        const clientSession = srp.deriveSession(eph.secret, serverPublic, serverSalt, username, privateKey);

        const proof = hexToArray(clientSession.proof);
        client.sendCommand(new ClientSRPBytesM(proof));
    }

    if (cmd instanceof ServerTimeOfDay) {
        console.log("Got server time of day: " + cmd.timeOfday);
    }

    if (cmd instanceof ServerAccessDenied) {
        console.log("Server access denied");
    }

    if (cmd instanceof ServerAuthAccept) {
        console.log(`Server access granted, seed=${cmd.seed} x=${cmd.posX}, y=${cmd.posY}, z=${cmd.posZ}`);
        client.sendCommand(new ClientInit2());
    }

    if (cmd instanceof ServerAnnounceMedia){
        console.log(`Server announced media, files=${cmd.fileCount}`);
        // store filename->hash association
        hashes = cmd.hashes;

        const reqMedia = new ClientRequestMedia();
        const filenameList = Object.keys(hashes);
        const promiseList = filenameList.map(filename => {
            const hash = hashes[filename];
            return mediaManager.hasMedia(hash);
        });

        Promise.all(promiseList).then(hasMediaList => {
            for (let i=0; i<hasMediaList.length; i++){
                const filename = filenameList[i];
                const hasMedia = hasMediaList[i];
                if (!hasMedia) {
                    reqMedia.names.push(filename);
                }
            }

            if (reqMedia.names.length > 0){
                console.log(`Requesting media, count=${reqMedia.names.length}`);
                client.sendCommand(reqMedia);
            } else {
                hasAllMedia = true;
                checkClientReady();
            }
        });
    }

    if (cmd instanceof ServerNodeDefinitions){
        console.log(`Got ${cmd.count} node-definitions`, cmd.nodeMapping);
        nodedefs = cmd;
        textureManager = new TextureManager(mediaManager, nodedefs);
    }

    if (cmd instanceof ServerMedia){
        console.log(`Got server media bunches=${cmd.bunches} index=${cmd.index} numFiles=${cmd.numFiles}`, cmd.files);

        const promises = [];
        Object.keys(cmd.files).forEach(filename => {
            const hash = hashes[filename];
            const data = cmd.files[filename];
            const p = mediaManager.addMedia(hash, filename, data);
            promises.push(p);
        });

        Promise.all(promises).then(() => {
            if (cmd.index+1 == cmd.bunches){
                hasAllMedia = true;
                checkClientReady();
            }
        });
    }

    if (cmd instanceof ServerCSMRestrictionFlags){
        console.log("Got CSM restriction flags");
        checkClientReady();
    }

    if (cmd instanceof ServerBlockData){
        console.log(`Got block data ${cmd.blockPos.X}/${cmd.blockPos.Y}/${cmd.blockPos.Z}`, cmd.blockData.blockMapping);
        if (mapblockCount >= 1){
            return;
        }

        //const view = new MapblockView(scene, cmd, textureManager, nodedefs);
        //await view.render();
        //mapblockCount++;
    }
});

