import { ServerCommand } from "./command";
import { ServerAccessDenied } from "./server_access_denied";
import { ServerAnnounceMedia } from "./server_announce_media";
import { ServerAuthAccept } from "./server_auth_accept";
import { ServerChatMessage } from "./server_chat_message";
import { ServerHello } from "./server_hello";
import { ServerMedia } from "./server_media";
import { ServerNodeDefinitions } from "./server_node_definitions";
import { ServerSRPBytesSB } from "./server_srp_bytes_s_b";
import { ServerTimeOfDay } from "./server_time_of_day";
import { ServerCSMRestrictionFlags } from "./server_csm_restriction_flags";
import { ServerBlockData } from "./server_block_data";

export function getServerCommand(commandId: number): ServerCommand|null {
    switch (commandId) {
        case 0x02: return new ServerHello()
        case 0x03: return new ServerAuthAccept()
        case 0x0A: return new ServerAccessDenied()
        case 0x20: return new ServerBlockData()
        case 0x2A: return new ServerCSMRestrictionFlags()
        case 0x29: return new ServerTimeOfDay()
        case 0x2F: return new ServerChatMessage()
        case 0x3A: return new ServerNodeDefinitions()
        case 0x3C: return new ServerAnnounceMedia()
        case 0x38: return new ServerMedia()
        case 0x60: return new ServerSRPBytesSB()
    }

    return null
}
