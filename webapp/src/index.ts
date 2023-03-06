import { CubeCamera } from "three"
import { generateEphemeral } from "secure-remote-password/client"
import { createDeflate } from "zlib"
import { CommandClient } from "./command/CommandClient"
import { ClientInit } from "./command/client/ClientInit"

console.log("start")

// test stuff

console.log(generateEphemeral().secret)
console.log(CubeCamera)
console.log(createDeflate())

// "real" stuff here

const host = "minetest";
const port = 30000;

const username = "test";
const password = "enter";

const ws = new WebSocket(`ws://127.0.0.1:8080/api/ws?host=${host}&port=${port}`);
const cmdClient = new CommandClient(ws);
cmdClient.sendCommand(new ClientInit(username))