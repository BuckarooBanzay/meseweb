import { Client } from "../Client";
import { ChunkedViewManager } from "./ChunkedViewManager";
import { WorldMap } from "./WorldMap";
import { AmbientLight, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import Logger from "js-logger";
import { MaterialManager } from "./MaterialManager";
import { Pos, PosType, toMatrix4 } from "../util/pos";
import { ServerMovePlayer } from "../command/server/ServerMovePlayer";



export class Scene {

    scene = new ThreeScene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    cvm = new ChunkedViewManager(this.wm, this.materialmanager, this.client.nodedefs)

    controls: OrbitControls
    renderer: WebGLRenderer
    stats = Stats()

    constructor(public client: Client, public wm: WorldMap, public materialmanager: MaterialManager, e: HTMLCanvasElement) {
        e.parentElement?.appendChild(this.stats.domElement)

        const light = new AmbientLight( 0xffffff )
        this.scene.add( light );

        this.renderer = new WebGLRenderer({ canvas: e })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.controls = new OrbitControls(this.camera, e)
        this.controls.listenToKeyEvents(document.body)
        this.controls.minDistance = 5
        this.controls.maxDistance = 500

        this.setCameraPosition(client.pos)

        wm.events.on("BlockAdded", b => {
            const cv = this.cvm.create(b.pos, b.pos)
            Logger.debug(`Adding ${cv.meshes.length} meshes to scene`)
            cv.meshes.forEach(m => this.scene.add(m))
        })

        client.cc.events.on("ServerCommand", cmd => {
            if (cmd instanceof ServerMovePlayer) {
                this.setCameraPosition(new Pos<PosType.Node>(cmd.posX, cmd.posY, cmd.posZ))
            }
        })
    }

    setCameraPosition(pos: Pos<PosType.Node>){
        const m = toMatrix4(pos)
        this.camera.position.setFromMatrixPosition(m)
        this.controls.target.setFromMatrixPosition(m)
        this.controls.update()
        console.log(`Setting camera position to ${pos}`)
    }

    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }
}