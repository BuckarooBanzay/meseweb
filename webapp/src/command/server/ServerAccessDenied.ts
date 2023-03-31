import { ServerCommand } from "../ServerCommand";

export enum DenyReason {
	SERVER_ACCESSDENIED_WRONG_PASSWORD,
	SERVER_ACCESSDENIED_UNEXPECTED_DATA,
	SERVER_ACCESSDENIED_SINGLEPLAYER,
	SERVER_ACCESSDENIED_WRONG_VERSION,
	SERVER_ACCESSDENIED_WRONG_CHARS_IN_NAME,
	SERVER_ACCESSDENIED_WRONG_NAME,
	SERVER_ACCESSDENIED_TOO_MANY_USERS,
	SERVER_ACCESSDENIED_EMPTY_PASSWORD,
	SERVER_ACCESSDENIED_ALREADY_CONNECTED,
	SERVER_ACCESSDENIED_SERVER_FAIL,
	SERVER_ACCESSDENIED_CUSTOM_STRING,
	SERVER_ACCESSDENIED_SHUTDOWN,
	SERVER_ACCESSDENIED_CRASH,
	SERVER_ACCESSDENIED_MAX
}

export class ServerAccessDenied implements ServerCommand {
    reason: DenyReason = 0

    unmarshalPacket(dv: DataView): void {
        this.reason = dv.getUint8(0)
    }
}