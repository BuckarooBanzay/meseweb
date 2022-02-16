package main

import (
	"embed"
	"fmt"
	"meseweb/webapp"
	"net/http"
	"os"
)

func main() {
	fmt.Println("ok")

	webdev := os.Getenv("WEBDEV") == "true"
	port := os.Getenv("PORT")
	if port == "" {
		// default port
		port = "8080"
	}

	fmt.Printf("Listening on port %s\n", port)
	mux := http.NewServeMux()
	// websocket
	mux.Handle("/api/ws", &WS{})
	// static files
	mux.Handle("/", http.FileServer(getFileSystem(webdev, webapp.Files)))

	http.HandleFunc("/", mux.ServeHTTP)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		panic(err)
	}
}

func getFileSystem(useLocalfs bool, content embed.FS) http.FileSystem {
	if useLocalfs {
		fmt.Println("using live mode")
		return http.FS(os.DirFS("webapp"))
	}

	fmt.Println("using embed mode")
	return http.FS(content)
}
