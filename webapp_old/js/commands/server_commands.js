import { ServerAccessDenied } from "./server_access_denied.js";
import { ServerAnnounceMedia } from "./server_announce_media.js";
import { ServerAuthAccept } from "./server_auth_accept.js";
import { ServerChatMessage } from "./server_chat_message.js";
import { ServerHello } from "./server_hello.js";
import { ServerMedia } from "./server_media.js";
import { ServerNodeDefinitions } from "./server_node_definitions.js";
import { ServerSRPBytesSB } from "./server_srp_bytes_s_b.js";
import { ServerTimeOfDay } from "./server_time_of_day.js";
import { ServerCSMRestrictionFlags } from "./server_csm_restriction_flags.js";
import { ServerBlockData } from "./server_block_data.js";
import { ServerMovePlayer } from "./server_move_player.js";

export function getServerCommand(commandId) {
    switch (commandId) {
        case 0x02: return new ServerHello();
        case 0x03: return new ServerAuthAccept();
        case 0x0A: return new ServerAccessDenied();
        case 0x20: return new ServerBlockData();
        case 0x2A: return new ServerCSMRestrictionFlags();
        case 0x29: return new ServerTimeOfDay();
        case 0x2F: return new ServerChatMessage();
        case 0x34: return new ServerMovePlayer();
        case 0x3A: return new ServerNodeDefinitions();
        case 0x3C: return new ServerAnnounceMedia();
        case 0x38: return new ServerMedia();
        case 0x60: return new ServerSRPBytesSB();
    }

    return null;
}
