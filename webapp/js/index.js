
import { Client } from "./client.js";
import { CommandClient } from './command_client.js';

const host = "minetest";
const port = 30000;

const username = "test";
const password = "enter";

const ws = new WebSocket(`ws://127.0.0.1:8080/api/ws?host=${host}&port=${port}`);
const cmdClient = new CommandClient(ws);
const client = new Client(cmdClient, username, password);
client.init();