import Logger from "js-logger";
import { CommandClient } from "./command/CommandClient"
import { Scene } from "./scene/Scene"
import { Client } from "./Client"
import { IndexedDBMediaManager } from "./media/IndexedDBMediaManager";
import { WorldMap } from "./scene/WorldMap";

const host = "minetest";
const port = 30000;

const username = "test";
const password = "enter";

const ws = new WebSocket(`ws://127.0.0.1:8080/api/ws?host=${host}&port=${port}`);
const cmdClient = new CommandClient(ws);

Logger.useDefaults({ defaultLevel: Logger.DEBUG })

const client = new Client(cmdClient)
client.mediamanager = new IndexedDBMediaManager()

client.login(username, password)
.then(() => {
    Logger.debug(`Creating worldmap store`)
    const wm = new WorldMap(cmdClient, client.nodedefs)
    Logger.info(`Connected to ${host}:${port}, creating scene`)
    const e = document.getElementById("scene")!
    const scene = new Scene(client, wm, e)
})
.catch(e => console.error(e))

window.addEventListener('beforeunload', function() {
    client.close();
});