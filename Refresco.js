import * as THREE from './libs/three.module.js'
import {ThreeBSP} from './libs/ThreeBSP.js'

class Refresco extends THREE.Object3D {
  constructor() {
    super();
    this.Refresco= new THREE.Object3D();

    const materialMulticolor = new THREE.MeshNormalMaterial();
    materialMulticolor.flatShading = true;
    materialMulticolor.needsUpdate = true;

    const materialTapa= new THREE.MeshPhongMaterial( { color: 0xffffff, transparent: true, opacity:0.9 } );
    const materialPajita= new THREE.MeshPhongMaterial( { color: 0x92c5fc, shininess: 20 } )
    const materialBaseDetail= new THREE.MeshPhongMaterial( { color: 0xffffff, shininess: 20 } )
    var VasoGeo= new THREE.CylinderGeometry(3.5, 2.5, 9.8, 100);
    var tapaGeo= new THREE.CylinderGeometry(3.7, 3.7, 0.8, 120);
    var tapaGeoResto= new THREE.CylinderGeometry(3.3, 3.3, 0.4, 120);
    var tapaGeoDetalle= new THREE.CylinderGeometry(1, 1.2, 0.4, 80);
    var pajita1Geo= new THREE.CylinderGeometry(0.25, 0.25, 7, 70);
    var pajita2Geo= new THREE.CylinderGeometry(0.25, 0.25, 2.8, 70);
    var articulacionPajitaGeo= new THREE.SphereGeometry(0.251, 20, 20);
    var torusGeo= new THREE.TorusBufferGeometry(2.5,0.06,40,40);
    
    this.VasoBSP= new ThreeBSP(VasoGeo);
    tapaGeo.translate(0,4.9,0);
    tapaGeoResto.translate(0,5.2,0);
    this.tapaBSP= new ThreeBSP(tapaGeo);
    this.tapaBSPResto= new ThreeBSP(tapaGeoResto);

    this.tapa2= this.tapaBSP.subtract(this.tapaBSPResto);
    this.articulacionPajita= new THREE.Mesh(articulacionPajitaGeo, materialPajita);
    this.pajita1= new THREE.Mesh(pajita1Geo, materialPajita);
    this.pajita2= new THREE.Mesh(pajita2Geo, materialPajita);
    this.BaseDetalle = new THREE.Mesh(torusGeo, materialBaseDetail);
    this.tapaDetalle = new THREE.Mesh(tapaGeoDetalle, materialTapa);

    this.articulacionPajita.position.set(-0.65, 8.31, 0);
    this.BaseDetalle.rotateX(Math.PI/2);
    this.BaseDetalle.position.set(0, -4.9, 0);
    this.tapaDetalle.position.set(0, 5.1, 0);

    this.pajita1.rotateZ(Math.PI/16);
    this.pajita1.position.set(0,5,0);
    this.pajita2.rotateZ(1.7*Math.PI/3);
    this.pajita2.position.set(-2.1,8,0);

    this.Vaso= this.VasoBSP.toBufferGeometry();
    this.BaseCompleta= new THREE.Mesh( this.Vaso, materialMulticolor );
    this.tapa= this.tapa2.toBufferGeometry();
    this.TapaCompleta= new THREE.Mesh( this.tapa, materialTapa );
    this.add(this.BaseCompleta);
    this.add(this.TapaCompleta);
    this.add(this.pajita1);
    this.add(this.pajita2);
    this.add(this.articulacionPajita);
    this.add(this.BaseDetalle);
    this.add(this.tapaDetalle);
    this.scale.set(0.4,0.4,0.4);

    this.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
          child.castShadow = true;
      }
  } );

  }
  
  update(){
    this.rotation.y += 0.20;
  }

}  
export { Refresco }