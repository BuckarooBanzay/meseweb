import { CubeCamera } from "three"
import { generateEphemeral } from "secure-remote-password/client"
import { createDeflate } from "zlib"

console.log("start")

console.log(generateEphemeral().secret)
console.log(CubeCamera)
console.log(createDeflate())