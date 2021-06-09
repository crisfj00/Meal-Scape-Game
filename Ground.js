import * as THREE from './libs/three.module.js'

class Ground extends THREE.Object3D {
  constructor() {
    super();
    
    var geom = new THREE.SphereBufferGeometry(300,90,90);

    const texture= new THREE.TextureLoader().load(
      './textures/cinta.jpg'
    );

    var mat = new THREE.MeshStandardMaterial( { map: texture}); 

    this.ground = new THREE.Mesh( geom, mat );
    this.ground.scale.set(1,1,1);
    this.ground.rotation.x=Math.PI/3;

    this.add(this.ground);    
  }
}

export { Ground };