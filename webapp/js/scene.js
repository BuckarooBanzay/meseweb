import { Pos } from './types/pos.js';
import { NodeDrawType } from './commands/server_node_definitions.js';

const directionMap = {
    "+x": new Pos(1,0,0),
    "-x": new Pos(-1,0,0),
    "+y": new Pos(0,1,0),
    "-y": new Pos(0,-1,0),
    "+z": new Pos(0,0,1),
    "-z": new Pos(0,0,-1)    
};

const directions = Object.keys(directionMap);
const airNodeId = 126;

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
        const transparentDrawTypes = {}
        transparentDrawTypes[NodeDrawType.NDT_AIRLIKE] = true;
        transparentDrawTypes[NodeDrawType.NDT_LIQUID] = true;
        transparentDrawTypes[NodeDrawType.NDT_FLOWINGLIQUID] = true;
        transparentDrawTypes[NodeDrawType.NDT_GLASSLIKE] = true;
        transparentDrawTypes[NodeDrawType.NDT_GLASSLIKE_FRAMED] = true;
        transparentDrawTypes[NodeDrawType.NDT_GLASSLIKE_FRAMED_OPTIONAL] = true;

        this.transparentNodeIds = {};
        this.transparentNodeIds[airNodeId] = true;

        Object.keys(this.nodedefs.nodeMapping).forEach(nodeId => {
            const nodedef = this.nodedefs.nodeMapping[nodeId];
            if (transparentDrawTypes[nodedef.drawType]) {
                this.transparentNodeIds[nodeId] = true;
            }
        });

        console.log(`Calculated transparent nodeIds`, this.transparentNodeIds);

        this.solidNodeIds = {};
        Object.keys(this.nodedefs.nodeMapping).forEach(nodeId => {
            const nodedef = this.nodedefs.nodeMapping[nodeId];
            if (nodedef.drawType == NodeDrawType.NDT_NORMAL) {
                this.solidNodeIds[nodeId] = true;
            }
        });

        console.log(`Calculated solid nodeIds`, this.solidNodeIds);
    }

    calculateFaces(blockdata){
        // nodeId -> { [dirKey] -> [] }
        const faces = {};

        function createEntry(){
            const entry = {};
            Object.keys(directionMap).forEach(dirKey => entry[dirKey] = []);
            return entry;
        }
    
        for (let x=0; x<16; x++){
            for (let y=0; y<16; y++){
                for (let z=0; z<16; z++){
                    const pos = new Pos(x,y,z);
                    const nodeId = blockdata.GetNodeID(pos);
                    const isSolid = this.solidNodeIds[nodeId];
                    if (!isSolid){
                        continue;
                    }

                    for (let d=0; d<directions.length; d++){
                        const dirKey = directions[d];
                        const dir = directionMap[dirKey];
                        const neighborPos = pos.add(dir);
                        if (neighborPos.X < 0 || neighborPos.X > 15 ||
                            neighborPos.Y < 0 || neighborPos.Y > 15 ||
                            neighborPos.Z < 0 || neighborPos.Z > 15) {
                                //skip neighboring mapblock
                                continue;
                            }

                        const neighborId = blockdata.GetNodeID(neighborPos);
                        const isTransparent = this.transparentNodeIds[neighborId];
    
                        if (isTransparent){
                            //draw the face in this direction
                            let nodeIdDirMap = faces[nodeId];
                            if (!nodeIdDirMap){
                                nodeIdDirMap = createEntry();
                                faces[nodeId] = nodeIdDirMap;
                            }
                            
                            nodeIdDirMap[dirKey].push(pos);
                        }
                    }
                }
            }
        }
    
        return faces;
    }

    updateMapblock(pos, blockdata) {
        if (pos.X == -12 && pos.Y == 0 && pos.Z == -12) {
            const faces = this.calculateFaces(blockdata);
            console.log(`Rendering mapblock ${pos.toString()}`, blockdata, faces);

            const renderMaterial = nodeid => {
                this.textureManager.getMaterial(nodeid).then(material => {
                    if (!material){
                        return;
                    }
                    //console.log(`material for id=${nodeid}`, material);

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