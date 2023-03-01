import { createAck } from "../packet/packetfactory.js";
import { PacketType } from "../packet/types.js";

export function AckHandler(client, pkg) {
    if (pkg.packetType == PacketType.Reliable){
        // send ack
        const ack = createAck(pkg, client.peerId);
        ack.channel = pkg.channel;
        setTimeout(() => client.sendPacket(ack), 200);
    }
}