package main

import "embed"

//go:embed webapp/index.html
var Files embed.FS
