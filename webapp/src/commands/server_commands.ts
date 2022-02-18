import { ServerCommand } from "./command";
import { ServerHello } from "./server_hello";
import { ServerSRPBytesSB } from "./server_srp_bytes_s_b";
import { ServerTimeOfDay } from "./server_time_of_day";

export function getServerCommand(commandId: number): ServerCommand|null {
    switch (commandId) {
    case 0x02:
        return new ServerHello()
    case 0x29:
        return new ServerTimeOfDay()
    case 0x60:
        return new ServerSRPBytesSB()
    }

    return null
}
