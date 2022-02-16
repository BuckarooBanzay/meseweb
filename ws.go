package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

type WS struct{}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (t *WS) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	fmt.Printf("Websocket request from %s\n", req.RemoteAddr)

	conn, err := upgrader.Upgrade(resp, req, nil)

	if err != nil {
		fmt.Printf("Websocket error: %s\n", err.Error())
		return
	}

	ch := make(chan []byte)

	for data := range ch {
		err := conn.WriteMessage(websocket.TextMessage, data)
		if err != nil {
			break
		}
	}

	close(ch)
}
