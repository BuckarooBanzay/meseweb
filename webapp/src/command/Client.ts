import srp from "secure-remote-password/client"
import { arrayToHex, hexToArray } from "../util/hex";
import { ClientFirstSRP } from "./client/ClientFirstSRP";
import { ClientInit } from "./client/ClientInit";
import { ClientSRPBytesA } from "./client/ClientSRPBytesA";
import { ClientSRPBytesM } from "./client/ClientSRPBytesM";
import { CommandClient } from "./CommandClient";
import { PacketType } from "./packet/types";
import { ServerAuthAccept } from "./server/ServerAuthAccept";
import { ServerHello } from "./server/ServerHello";
import { ServerSRPBytesSB } from "./server/ServerSRPBytesSB";

export class Client {

    eph = srp.generateEphemeral()

    constructor(public cc: CommandClient) {}

    Login(username: string, password: string): Promise<void> {
        return this.cc.OnReady()
        .then(() => this.cc.PeerInit())
        .then(() => new Promise(resolve => setTimeout(resolve, 1000)))
        .then(() => this.cc.ExchangeCommand(new ClientInit(username), PacketType.Original, ServerHello))
        .then(sh => {
            if (sh.authMechanismFirstSrp) {
                const salt = srp.generateSalt()
                const private_key = srp.derivePrivateKey(salt, username, password)
                const verifier = srp.deriveVerifier(private_key)
                const cmd = new ClientFirstSRP(hexToArray(salt), hexToArray(verifier))
                return this.cc.ExchangeCommand(cmd, PacketType.Reliable, ServerSRPBytesSB)

            } else {
                const cmd = new ClientSRPBytesA(hexToArray(this.eph.public))
                return this.cc.ExchangeCommand(cmd, PacketType.Reliable, ServerSRPBytesSB)
            }
        })
        .then(cmd => {
            const serverSalt = arrayToHex(cmd.bytesS);
            const serverPublic = arrayToHex(cmd.bytesB);
    
            const privateKey = srp.derivePrivateKey(serverSalt, username, password);
            const clientSession = srp.deriveSession(this.eph.secret, serverPublic, serverSalt, username, privateKey);
    
            const proof = hexToArray(clientSession.proof);
            return this.cc.ExchangeCommand(new ClientSRPBytesM(proof), PacketType.Reliable, ServerAuthAccept);
        })
        .then(aa => {
            // TODO: control flow
        })
    }
}