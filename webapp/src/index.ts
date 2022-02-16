
import * as srp from "secure-remote-password/client"
import { CreatePing } from "./packet"

console.log("ok", srp)

const ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000")
ws.onerror = console.log.bind(console)
ws.onclose = console.log.bind(console)
ws.onmessage = console.log.bind(console)
ws.onopen = function(){
    const ping = CreatePing()
    ws.send(ping.Marshal())    
}

/*
ws = new WebSocket("ws://127.0.0.1:8080/api/ws?host=minetest&port=30000");
ws.onerror = console.log.bind(console);
ws.onclose = console.log.bind(console);
ws.onmessage = console.log.bind(console);
buf = new Uint8Array(11);
buf[0] = 0x4f;
buf[1] = 0x45;
buf[2] = 0x74;
buf[3] = 0x03;
buf[6] = 0x00; // peerid
buf[7] = 0x00; // control
buf[8] = 0x02; // ping
buf[9] = 0x00; // seqnr
buf[10] = 0x00; // seqnr


ws.send(buf)
*/