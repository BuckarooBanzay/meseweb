import { CommandClient } from "./command/CommandClient"
import { Scene } from "./Scene"
import { Client } from "./Client"
import { ServerBlockData } from "./command/server/ServerBlockData";

const host = "minetest";
const port = 30000;

const username = "test";
const password = "enter";

const ws = new WebSocket(`ws://127.0.0.1:8080/api/ws?host=${host}&port=${port}`);
const cmdClient = new CommandClient(ws);

const client = new Client(cmdClient)
client.login(username, password)
.then(() =>{
    const e = document.getElementById("scene")!
    const scene = new Scene(client, e)
})

cmdClient.events.addListener("ServerCommand", cmd => {
    if (cmd instanceof ServerBlockData) {
        console.log(cmd)
    }
})

window.addEventListener('beforeunload', function() {
    client.close();
});