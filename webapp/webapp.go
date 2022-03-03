package webapp

import "embed"

//go:embed index.html
//go:embed js/*
var Files embed.FS
