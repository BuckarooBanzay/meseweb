
export class Scene {

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.listenToKeyEvents(document.body);
        //this.controls.enableDamping = true;
        //this.controls.dampingFactor = 0.05;
        //this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 500;
        //this.controls.maxPolarAngle = Math.PI / 2;

        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );
    
        this.camera.position.z = 30;
        this.camera.position.x = 5;
        this.camera.position.y = 2;

        this.animate();
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    init(textureManager, nodedefs) {
        this.textureManager = textureManager;
        this.nodedefs = nodedefs;
    }

    updateMapblock(pos, blockdata) {
        if (pos.X == -12 && pos.Y == 0 && pos.Z == -12) {
            const renderMaterial = nodeid => {
                this.textureManager.getMaterial(nodeid).then(material => {
                    if (!material){
                        return;
                    }
                    console.log(`material for id=${nodeid}`, material);

                    const sideGeometry = new THREE.PlaneGeometry(1,1);
                    const cube = new THREE.Mesh( sideGeometry, material );
                    cube.translateX(nodeid+1);
                    this.scene.add( cube );
                });
            };

            Object.keys(this.nodedefs.nodeMapping).forEach(nodeid => renderMaterial(+nodeid));
        }
        // TODO
    }

    animate(){
        this.stats.begin();
        this.renderer.render(this.scene, this.camera);
        this.stats.end();

        this.controls.update();

        requestAnimationFrame(() => this.animate());
    }
}