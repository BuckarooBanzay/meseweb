import { Client } from "../Client";
import { ChunkedViewManager } from "./ChunkedViewManager";
import { MaterialProvider } from "./MaterialProvider";
import { WorldMap } from "./WorldMap";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import Logger from "js-logger";

export class Scene {

    scene = new ThreeScene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    controls: OrbitControls
    renderer: WebGLRenderer
    stats = Stats()

    constructor(public client: Client, public wm: WorldMap, e: HTMLCanvasElement) {
        e.parentElement?.appendChild(this.stats.domElement)

        this.renderer = new WebGLRenderer({ canvas: e })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.controls = new OrbitControls(this.camera, e)
        this.controls.listenToKeyEvents(document.body)
        this.controls.minDistance = 5
        this.controls.maxDistance = 500

        //document.body.appendChild(this.renderer.domElement)

        wm.events.on("BlockAdded", b => {
            this.cvm.create(b.pos, b.pos)
            .then(cv => {
                //TODO: add meshes to scene
                Logger.debug(`Adding ${cv.meshes.length} meshes to scene`)
                cv.meshes.forEach(m => this.scene.add(m))
            })
        })

        const geometry = new BoxGeometry(1,1,1)
        const material = new MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new Mesh( geometry, material );

        this.scene.add(cube)
    }

    materialprovider = new MaterialProvider(this.client)
    cvm = new ChunkedViewManager(this.wm, this.materialprovider, this.client.nodedefs)

    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }
}