import * as THREE from './libs/three.module.js'
import { ThreeBSP } from './libs/ThreeBSP.js'
 
class Bombilla extends THREE.Object3D {
  constructor() {
    super();
    
    var bulbGem = new THREE.SphereGeometry(4,20,20);
    var cilinderMidGem = new THREE.CylinderGeometry(3,2,2,20,20);
    var cilinderGem = new THREE.CylinderGeometry(2,2,2,20,20);
    var midBulbGem = new THREE.SphereGeometry(1.5,20,20);

    var bulbMat = new THREE.MeshPhongMaterial( {specular: 0xffff00, color: 0xc9c580, transparent: true, opacity:0.83} );
    
    bulbGem.translate(0,8,0);
    cilinderMidGem.translate(0,4.5,0);
    cilinderGem.translate(0,2.5,0);
    midBulbGem.translate(0,1.5,0);

    var bulb= new ThreeBSP(bulbGem);
    var cilinder= new ThreeBSP(cilinderGem);
    var cilinderMid= new ThreeBSP(cilinderMidGem);
    var mid= new ThreeBSP(midBulbGem);


    var partialResult = bulb.union(cilinderMid);

    var partResult=cilinder.union(mid);

    var geometry=partialResult.toGeometry();
    var bufferGeometry=new THREE.BufferGeometry().fromGeometry(geometry);

    var geometryDown=partResult.toGeometry();
    var bufferGeometryDown=new THREE.BufferGeometry().fromGeometry(geometryDown);

    var material = new THREE.MeshStandardMaterial( { color: 0xd6dde0, roughness:0, metalness:0.3} );
    material.flatShading=false;

    this.enganche=new THREE.Mesh(bufferGeometryDown,material);
    this.bombilla=new THREE.Mesh(bufferGeometry,bulbMat);
    this.add(this.bombilla);
    this.add(this.enganche);

    this.scale.set(0.4,0.4,0.4);

  }

  update () {
    this.rotation.y += 0.05;
  }
}

export { Bombilla };


