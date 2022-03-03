
export class ServerTimeOfDay {
    UnmarshalPacket(dv) {
        this.timeOfday = dv.getUint16(0);
    }

}