import 'jest'
import { Client } from './client'

describe("client tests", function(){
    it("emits events properly", function(){
        let openFn: Function = function(){}
        let messageFn: Function = function(){}
        const mockSocket = {
            addEventListener(key: string, fn: Function){
                if (key == "open"){
                    openFn = fn
                } else if (key == "message") {
                    messageFn = fn
                }
            },
            send(buf: Uint8Array){
                //TODO
            }
        }

        const c = new Client(<WebSocket>mockSocket)
        openFn()
    })
})