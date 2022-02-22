
Command payload to localstorage
```js
const d = new Array<number>(dv.byteLength)
for (let i=0; i<dv.byteLength; i++){
    d[i] = dv.getUint8(i)
}
localStorage.setItem("server_block_data", JSON.stringify(d))
```