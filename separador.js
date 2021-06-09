import * as THREE from './libs/three.module.js'

class Separador extends THREE.Object3D {
  constructor() {
    super();
    const texture= new THREE.TextureLoader().load(
      './textures/separador.jpg'
    );

    const material= new THREE.MeshLambertMaterial({ map: texture });
    var separadorGeo= new THREE.CylinderGeometry(1.8, 1.8, 14, 3);

    this.separador = new THREE.Mesh(separadorGeo, material);
    
    this.separador.scale.set(1,0.55,1)

    this.separador.rotateX(Math.PI/2);

    this.separador.rotateY(Math.PI/3);
    
    this.separador.position.set(0, 1, 0);
    
    this.add(this.separador);

    this.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
          child.castShadow = true;
      }
  } );
  }
}  
export { Separador }