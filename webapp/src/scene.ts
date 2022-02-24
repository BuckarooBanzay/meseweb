import { Scene as ThreeScene, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export class Scene {
    scene: ThreeScene
    camera: PerspectiveCamera
    renderer: WebGLRenderer
    controls: OrbitControls
    stats = Stats()

    constructor() {
        this.scene = new ThreeScene()
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new WebGLRenderer()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
        document.body.appendChild(this.stats.dom);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.listenToKeyEvents(document.body);
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.05
        this.controls.screenSpacePanning = false
        this.controls.minDistance = 5
        this.controls.maxDistance = 500
        this.controls.maxPolarAngle = Math.PI / 2
    
        this.camera.position.z = 30
        this.camera.position.x = 5
        this.camera.position.y = 2

        this.animate()
        window.addEventListener("resize", () => this.onWindowResize(), false)
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)
    }

    animate(){
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()

        requestAnimationFrame(() => this.animate())
    }
}