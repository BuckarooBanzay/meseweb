package main

import (
	"fmt"
	"net"
	"net/http"
	"strconv"

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

func SendError(w http.ResponseWriter, code int, message string) {
	w.Header().Set("Content-Type", "text/plain; charset=UTF-8")
	w.WriteHeader(code)
	w.Write([]byte(message))
}

func (t *WS) ServeHTTP(resp http.ResponseWriter, req *http.Request) {
	target_host := req.URL.Query().Get("host")
	target_port_str := req.URL.Query().Get("port")
	fmt.Printf("Websocket request from %s to %s:%s\n", req.RemoteAddr, target_host, target_port_str)

	target_port, err := strconv.ParseInt(target_port_str, 10, 64)
	if err != nil {
		SendError(resp, 500, fmt.Sprintf("Invalid port: %s", target_port_str))
		return
	}

	conn, err := upgrader.Upgrade(resp, req, nil)
	if err != nil {
		SendError(resp, 500, fmt.Sprintf("Websocket error: %s\n", err.Error()))
		return
	}

	udp_conn, err := net.Dial("udp", fmt.Sprintf("%s:%d", target_host, target_port))
	if err != nil {
		SendError(resp, 500, fmt.Sprintf("udp socket error: %s\n", err.Error()))
		return
	}

	err_chan := make(chan error, 10)

	// udp -> ws
	go func() {
		for {
			buf := make([]byte, 1024)
			len, err := udp_conn.Read(buf)
			if err != nil {
				err_chan <- err
				return
			}

			//fmt.Printf("Relaying %d bytes to the websocket\n", len)
			err = conn.WriteMessage(websocket.BinaryMessage, buf[:len])
			if err != nil {
				err_chan <- err
				return
			}
		}
	}()

	// ws -> udp
	go func() {
		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				err_chan <- err
				return
			}

			//fmt.Printf("Relaying %d bytes to the udp socket\n", len(data))
			_, err = udp_conn.Write(data)
			if err != nil {
				err_chan <- err
				return
			}
		}
	}()

	err = <-err_chan
	fmt.Printf("ws-error: %s\n", err.Error())
	conn.Close()
	udp_conn.Close()
}
