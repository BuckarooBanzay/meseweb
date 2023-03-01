import { CubeCamera } from "three";
import { generateEphemeral } from "secure-remote-password/client";

console.log("start");

console.log(generateEphemeral().secret);
console.log(CubeCamera);