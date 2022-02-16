package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	fmt.Println("ok")

	port := os.Getenv("PORT")
	if port == "" {
		// default port
		port = "8080"
	}

	fmt.Printf("Listening on port %s\n", port)
	mux := http.NewServeMux()
	mux.Handle("/api/ws", &WS{})

	http.HandleFunc("/", mux.ServeHTTP)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		panic(err)
	}
}
