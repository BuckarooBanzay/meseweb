import { Client } from "../client";
import { createAck } from "../packet/packetfactory";
import { Packet, PacketType } from "../packet/types";

export function AckHandler(client: Client, p: Packet) {
    if (p.packetType == PacketType.Reliable){
        // send ack
        const ack = createAck(p, client.peerId)
        ack.channel = p.channel
        setTimeout(() => client.sendPacket(ack), 200)
    }
}