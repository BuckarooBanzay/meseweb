import Logger from "js-logger";
import { CommandClient } from "./command/CommandClient"
import { Scene } from "./scene/Scene"
import { Client } from "./Client"
import { IndexedDBMediaManager } from "./media/IndexedDBMediaManager";
import { WorldMap } from "./scene/WorldMap";
import { MaterialManager } from "./scene/MaterialManager";

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
    Logger.info(`Generating material for ${client.nodedefs.size} node-defs`)
    const mm = new MaterialManager(client.nodedefs, client.mediamanager)
    return mm.generate().then(() => mm)
})
.then((mm) => {
    const wm = new WorldMap(cmdClient, client.nodedefs)
    Logger.info(`Connected to ${host}:${port}, creating scene`)
    const e = document.getElementById("scene") as HTMLCanvasElement
    const scene = new Scene(client, wm, mm, e)
    scene.animate()
})
.catch(e => console.error(e))

window.addEventListener('beforeunload', function() {
    client.close();
});