
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
import { TextureManager } from "./texturemanager.js";
import { arrayToHex, hexToArray } from "./util/hex.js";

export class Client {
    constructor(cmdClient, username, password) {
        this.cmdClient = cmdClient;
        this.username = username;
        this.password = password;

        this.mediaManager = new MediaManager();
        this.eph = srp.generateEphemeral();
        // filename -> hash
        this.hashes = {};
    }

    init() {
        this.cmdClient.addReadyListener(c => {
            setTimeout(() => {
                console.log("Sending INIT");
                c.sendCommand(new ClientInit(this.username), PacketType.Original);
            }, 100);
        });
        this.cmdClient.addCommandListener(this.onCommand.bind(this));
    }

    checkClientReady() {
        if (this.clientReadyTriggered || !this.hasAllMedia) {
            return;
        }
        this.clientReadyTriggered = true;
    
        console.log(`Sending CLIENT_READY`);
        this.cmdClient.sendCommand(new ClientReady());
    
        const ppos = new ClientPlayerPos();
        ppos.fov = 149;
        ppos.requestViewRange = 13;
        this.cmdClient.sendCommand(ppos, PacketType.Original);
    }
    

    onCommand(client, cmd){
        if (cmd instanceof ServerHello){
            console.log(`Got server hello, protocol=${cmd.protocolVersion}`);
    
            if (cmd.authMechanismFirstSrp) {
                const salt = srp.generateSalt();
                const privateKey = srp.derivePrivateKey(salt, this.username, this.password);
                const verifier = srp.deriveVerifier(privateKey);
                client.sendCommand(new ClientFirstSRP(hexToArray(salt), hexToArray(verifier)));
    
            } else if (cmd.authMechanismSrp) {
                const a = hexToArray(this.eph.public);
                client.sendCommand(new ClientSRPBytesA(a));
    
            }
        }
    
        if (cmd instanceof ServerSRPBytesSB) {
            console.log("Got server bytes S+B");
    
            const serverSalt = arrayToHex(cmd.bytesS);
            const serverPublic = arrayToHex(cmd.bytesB);
    
            const privateKey = srp.derivePrivateKey(serverSalt, this.username, this.password);
            const clientSession = srp.deriveSession(this.eph.secret, serverPublic, serverSalt, this.username, privateKey);
    
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
            this.hashes = cmd.hashes;
    
            const reqMedia = new ClientRequestMedia();
            const filenameList = Object.keys(this.hashes);
            const promiseList = filenameList.map(filename => {
                const hash = this.hashes[filename];
                return this.mediaManager.hasMedia(hash);
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
                    this.hasAllMedia = true;
                    this.checkClientReady();
                }
            });
        }
    
        if (cmd instanceof ServerNodeDefinitions){
            console.log(`Got ${cmd.count} node-definitions`, cmd.nodeMapping);
            this.nodedefs = cmd;
            this.textureManager = new TextureManager(this.mediaManager, this.nodedefs);
        }
    
        if (cmd instanceof ServerMedia){
            console.log(`Got server media bunches=${cmd.bunches} index=${cmd.index} numFiles=${cmd.numFiles}`, cmd.files);
    
            const promises = [];
            Object.keys(cmd.files).forEach(filename => {
                const hash = hashes[filename];
                const data = cmd.files[filename];
                const p = this.mediaManager.addMedia(hash, filename, data);
                promises.push(p);
            });
    
            Promise.all(promises).then(() => {
                if (cmd.index+1 == cmd.bunches){
                    this.hasAllMedia = true;
                    this.checkClientReady();
                }
            });
        }
    
        if (cmd instanceof ServerCSMRestrictionFlags){
            console.log("Got CSM restriction flags");
            this.checkClientReady();
        }
    
        if (cmd instanceof ServerBlockData){
            console.log(`Got block data ${cmd.blockPos.X}/${cmd.blockPos.Y}/${cmd.blockPos.Z}`, cmd.blockData.blockMapping);
    
            //const view = new MapblockView(scene, cmd, textureManager, nodedefs);
            //await view.render();
            //mapblockCount++;
        }
    }

}