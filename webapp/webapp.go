package webapp

import "embed"

//go:embed index.html
//go:embed dist/*
var Files embed.FS
