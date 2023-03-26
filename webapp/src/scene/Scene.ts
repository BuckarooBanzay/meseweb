import { Client } from "../Client";
import { ChunkedViewManager } from "./ChunkedViewManager";
import { MaterialProvider } from "./MaterialProvider";
import { WorldMap } from "./WorldMap";
import { AmbientLight, BoxGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene as ThreeScene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import Logger from "js-logger";
import { Pos, PosType } from "../util/pos";

const rotations = {
    X_NEG: new Matrix4().makeRotationY(-Math.PI/2),
    X_POS: new Matrix4().makeRotationY(Math.PI/2),
    Y_NEG: new Matrix4().makeRotationX(Math.PI/2),
    Y_POS: new Matrix4().makeRotationX(-Math.PI/2),
    Z_NEG: new Matrix4().makeRotationX(Math.PI),
    Z_POS: new Matrix4()
}

const face_offsets = {
    X_NEG: new Pos<PosType.Node>(-0.5, 0, 0),
    X_POS: new Pos<PosType.Node>(0.5, 0, 0),
    Y_NEG: new Pos<PosType.Node>(0, -0.5, 0),
    y_POS: new Pos<PosType.Node>(0, 0.5, 0),
    Z_NEG: new Pos<PosType.Node>(0, 0, -0.5),
    Z_POS: new Pos<PosType.Node>(0, 0, 0.5)
};

const side_geometry = new PlaneGeometry(1, 1);

export class Scene {

    scene = new ThreeScene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    materialprovider = new MaterialProvider(this.client)
    cvm = new ChunkedViewManager(this.wm, this.materialprovider, this.client.nodedefs)

    controls: OrbitControls
    renderer: WebGLRenderer
    stats = Stats()

    constructor(public client: Client, public wm: WorldMap, e: HTMLCanvasElement) {
        e.parentElement?.appendChild(this.stats.domElement)

        const light = new AmbientLight( 0xffffff )
        this.scene.add( light );

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

        this.materialprovider.getMaterial("default_diamond_block.png")
        .then(material => {
            const x_items = 250
            const z_items = 250
            let i = 0
            const im = new InstancedMesh(side_geometry, material, x_items * z_items)
            for (let x=0;x<x_items; x++) {
                for (let z=0;z<z_items; z++) {
                    const matrix = new Matrix4().makeTranslation(x,0,z).multiply(rotations.Y_POS)
                    im.setMatrixAt(i++, matrix)
                }
            }
    
            this.scene.add(im)
        })
    }


    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }
}