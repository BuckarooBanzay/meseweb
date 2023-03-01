package webapp

import "embed"

//go:embed index.html
//go:embed node_modules/dexie/dist/dexie.min.js
//go:embed node_modules/three/build/three.min.js
//go:embed node_modules/zlibjs/bin/zlib_and_gzip.min.js
//go:embed lib/srp.bundle.js
//go:embed js/*
var Files embed.FS
