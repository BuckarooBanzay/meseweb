import { ClientInit } from "./commands/client_init.js";
import { getServerCommand } from "./commands/server_commands.js";
import { AckHandler } from "./handler/ack_handler.js";
import { marshal, setSeqNr, unmarshal } from "./packet/marshal.js";
import { createCommandPacket, createDisconnect, createPeerInit } from "./packet/packetfactory.js";
import { SplitPacketHandler } from "./packet/splitpackethandler.js";
import { ControlType, PacketType } from "./packet/types.js";

export class CommandClient {
    constructor(ws){
        this.packetListeners = [];
        this.readyListeners = [];
        this.commandListeners = [];

        this.ws = ws;
        ws.addEventListener("message", ev => this.onMessage(ev));
        ws.addEventListener("open", () => this.onOpen());

        // register handlers
        this.addPacketListener(AckHandler);

        this.peerId = 0;
        this.splitHandler = new SplitPacketHandler();
    }

    onOpen() {
        this.open = true;
        console.log("websocket opened");
        this.sendPacket(createPeerInit());
        this.readyListeners.forEach(l => l(this));
    }

    close(){
        this.sendPacket(createDisconnect());
        this.ws.close();
    }

    onMessage(ev) {
        ev.data.arrayBuffer().then(ab => {
            const buf = new Uint8Array(ab);
            const p = unmarshal(buf);
            //console.log("RX>>> " + p, p)
    
            // emit packet events
            this.packetListeners.forEach(h => h(this, p));
    
            if (p.packetType == PacketType.Reliable){
                if (p.controlType == ControlType.SetPeerID){
                    // set peer id
                    this.peerId = p.peerId;
                    console.log("Set peerId to " + this.peerId);
                    return;
                }
    
                if (p.subtype == PacketType.Original){
                    this.parseCommandPayload(p.payloadView);
                }
    
                if (p.subtype == PacketType.Split) {
                    const payload = this.splitHandler.AddSplitPacket(p);
                    if (payload != null) {
                        // all split parts arrived
                        this.parseCommandPayload(new DataView(payload.buffer));
                    }
                }
            }
        });
    }

    parseCommandPayload(dv){
        if (this.ws.readyState != WebSocket.OPEN){
            return;
        }

        const cmdId = dv.getUint16(0);
        try {
            const cmd = getServerCommand(cmdId);
            if (cmd != null){
                cmd.UnmarshalPacket(new DataView(dv.buffer, dv.byteOffset + 2));
                this.onCommandReceived(cmd);
            } else {
                console.log("Unknown command received: " + cmdId);
            }
        } catch (e) {
            console.error(e);
            console.log("Caught error, aborting");
            this.close();
        }
    }

    onCommandReceived(cmd){
        this.commandListeners.forEach(l => l(this, cmd));
    }

    sendPacket(p){
        p.peerId = this.peerId;

        //TODO: track reliable seqNr
        //console.log("TX<<< " + p, p)
        this.ws.send(marshal(p));
    }

    sendCommand(cmd, type) {
        const packets = createCommandPacket(cmd, this.peerId, type || PacketType.Reliable);
        packets.forEach(p => this.sendPacket(p));

        if (cmd instanceof ClientInit){
            setSeqNr(65500-1);
        }
    }

    addPacketListener(p) {
        this.packetListeners.push(p);
    }

    addCommandListener(h) {
        this.commandListeners.push(h);
    }

    addReadyListener(h){
        if (this.open) {
            // already open/ready
            h(this);
        } else {
            // defer until open
            this.readyListeners.push(h);
        }
    }
}