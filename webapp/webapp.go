package webapp

import "embed"

//go:embed index.html
//go:embed dist/bundle.js
var Files embed.FS
