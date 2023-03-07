import srp from "secure-remote-password/client"
import { arrayToHex, hexToArray } from "./util/hex";
import { ClientFirstSRP } from "./command/client/ClientFirstSRP";
import { ClientInit } from "./command/client/ClientInit";
import { ClientSRPBytesA } from "./command/client/ClientSRPBytesA";
import { ClientSRPBytesM } from "./command/client/ClientSRPBytesM";
import { CommandClient } from "./command/CommandClient";
import { PacketType } from "./command/packet/types";
import { ServerAccessDenied } from "./command/server/ServerAccessDenied";
import { ServerAuthAccept } from "./command/server/ServerAuthAccept";
import { ServerHello } from "./command/server/ServerHello";
import { ServerSRPBytesSB } from "./command/server/ServerSRPBytesSB";
import { NodeDefinition } from "./nodedefs/NodeDefinition";
import { ServerNodeDefinitions } from "./command/server/ServerNodeDefinitions";
import { ParseNodeDefinitions } from "./nodedefs/parser";
import { ServerAnnounceMedia } from "./command/server/ServerAnnounceMedia";
import { ClientRequestMedia } from "./command/client/ClientRequestMedia";
import { ServerMedia } from "./command/server/ServerMedia";
import { MediaManager } from "./media/MediaManager";
import { InMemoryMediaManager } from "./media/InMemoryMediaManager";
import { ClientInit2 } from "./command/client/ClientInit2";
import { ClientReady } from "./command/client/ClientReady";

export class Client {

    constructor(public cc: CommandClient) {}

    eph = srp.generateEphemeral()
    nodedefs = new Array<NodeDefinition>
    mediamanager: MediaManager = new InMemoryMediaManager

    media_ready = new Promise((resolve, reject) => {
        this.cc.events.on("ServerCommand", cmd => {
            if (cmd instanceof ServerAnnounceMedia) {
                // TODO: request missing media
                console.log(cmd)
                const crm = new ClientRequestMedia()
                crm.names.push("wool_blue.png")
                this.cc.sendCommand(crm)

            } else if (cmd instanceof ServerMedia) {
                console.log(cmd)
                // TODO: store media locally
                resolve(null)

            }
        })
    })

    nodedefs_ready = new Promise((resolve, reject) => {
        this.cc.events.on("ServerCommand", cmd => {
            if (cmd instanceof ServerNodeDefinitions) {
                this.nodedefs = ParseNodeDefinitions(cmd)
                resolve(null)
            } 
        })
    })

    login(username: string, password: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.cc.events.once("ServerCommand", cmd => {
                if (cmd instanceof ServerAccessDenied) {
                    reject()
                }
            })

            this.cc.ready
            .then(() => this.cc.peerInit())
            .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
            .then(() => this.cc.exchangeCommand(new ClientInit(username), PacketType.Original, ServerHello))
            .then(sh => {
                if (sh.authMechanismFirstSrp) {
                    const salt = srp.generateSalt()
                    const private_key = srp.derivePrivateKey(salt, username, password)
                    const verifier = srp.deriveVerifier(private_key)
                    const cmd = new ClientFirstSRP(hexToArray(salt), hexToArray(verifier))
                    return this.cc.exchangeCommand(cmd, PacketType.Reliable, ServerSRPBytesSB)
    
                } else {
                    const cmd = new ClientSRPBytesA(hexToArray(this.eph.public))
                    return this.cc.exchangeCommand(cmd, PacketType.Reliable, ServerSRPBytesSB)
                }
            })
            .then(cmd => {
                const serverSalt = arrayToHex(cmd.bytesS);
                const serverPublic = arrayToHex(cmd.bytesB);
        
                const privateKey = srp.derivePrivateKey(serverSalt, username, password);
                const clientSession = srp.deriveSession(this.eph.secret, serverPublic, serverSalt, username, privateKey);
        
                const proof = hexToArray(clientSession.proof);
                return this.cc.exchangeCommand(new ClientSRPBytesM(proof), PacketType.Reliable, ServerAuthAccept);
            })
            .then(aa => {
                // TODO: player pos
                return this.cc.sendCommand(new ClientInit2())
            })
            .then(() => {
                return Promise.all([this.nodedefs_ready, this.media_ready])
            })
            .then(() => {
                return this.cc.sendCommand(new ClientReady())
            })
            .then(() => resolve())
            .catch(e => reject(e))
        })
    }

    close() {
        this.cc.close()
    }
}