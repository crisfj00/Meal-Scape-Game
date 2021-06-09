import * as THREE from './libs/three.module.js'

class Cereales extends THREE.Object3D {
  constructor() {
    super();
    const texture_portada= new THREE.TextureLoader().load(
      './textures/ChocapicAvellana.jpg'
    );
    const texture_lateral= new THREE.TextureLoader().load(
      './textures/lateral_cereal.jpg'
    );

    var geometry = new THREE.BoxGeometry( 8, 15 , 4);
    var materials = [
    	new THREE.MeshLambertMaterial( { map: texture_lateral } ),
      new THREE.MeshLambertMaterial( { map: texture_lateral } ),
      new THREE.MeshLambertMaterial( { color: 0x5ca623 } ),
      new THREE.MeshLambertMaterial( { color: 0x512818 } ),
      new THREE.MeshLambertMaterial( { map: texture_portada } ),
      new THREE.MeshLambertMaterial( { map: texture_portada } )
    ];

    this.cereales = new THREE.Mesh( geometry, materials );
    this.cereales.position.set(0, 7.5, 0);

    

    this.add( this.cereales );

    this.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
          child.castShadow = true;
      }
  } );
    
  
  }
}  
export { Cereales }